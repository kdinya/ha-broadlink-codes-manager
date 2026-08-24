"""Broadlink Codes Manager.

A maintenance panel for the codes learned by Home Assistant's Broadlink
`remote` entities: browse, test, copy, rename, delete, and learn new
commands - without touching `.storage/broadlink_remote_<mac>_codes` by
hand.

Setup is entirely through the UI (Settings -> Devices & Services -> Add
Integration -> Broadlink Codes Manager -> Submit). No YAML editing
required; there is nothing to configure.
"""
from __future__ import annotations

import logging

import voluptuous as vol

from homeassistant.components import panel_custom
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall, SupportsResponse

from .const import (
    DATA_ENTRIES,
    DOMAIN,
    PANEL_JS_URL,
    PANEL_URL_PATH,
    SERVICE_COPY_COMMAND,
    SERVICE_LEARN_COMMAND,
    SERVICE_LIST_CODES,
    SERVICE_RENAME_COMMAND,
)
from .entity_access import (
    async_ensure_storage_loaded,
    get_broadlink_remotes,
    get_remote_by_entity_id,
    iter_devices,
)

_LOGGER = logging.getLogger(__name__)

RENAME_SCHEMA = vol.Schema(
    {
        vol.Required("entity_id"): str,
        vol.Required("device"): str,
        vol.Required("old_command"): str,
        vol.Required("new_command"): str,
    }
)

LEARN_SCHEMA = vol.Schema(
    {
        vol.Required("entity_id"): str,
        vol.Required("device"): str,
        vol.Required("command"): str,
        vol.Optional("alternative", default=False): bool,
        vol.Optional("timeout", default=20): vol.All(int, vol.Range(min=5, max=60)),
    }
)

COPY_SCHEMA = vol.Schema(
    {
        vol.Required("entity_id"): str,
        vol.Required("device"): str,
        vol.Required("command"): str,
        vol.Optional("target_entity_id"): str,
        vol.Required("target_device"): str,
        vol.Optional("target_command"): str,
        vol.Optional("overwrite", default=False): bool,
    }
)

ALL_SERVICES = (
    SERVICE_LIST_CODES,
    SERVICE_RENAME_COMMAND,
    SERVICE_LEARN_COMMAND,
    SERVICE_COPY_COMMAND,
)


def _codes_payload(entity) -> dict:
    devices: dict[str, dict] = {}
    for device, commands in iter_devices(entity):
        cmd_out = {}
        for cmd_name, value in commands.items():
            if isinstance(value, list):
                cmd_out[cmd_name] = {"toggle": True, "codes": value}
            else:
                cmd_out[cmd_name] = {"toggle": False, "codes": [value]}
        devices[device] = cmd_out
    return devices


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Broadlink Codes Manager from a config entry.

    Services and the sidebar panel are global (not per-entry), and this
    integration only ever allows a single entry (enforced in the config
    flow), so the first entry registers everything and the last one to
    unload tears it down.
    """
    domain_data = hass.data.setdefault(DOMAIN, {DATA_ENTRIES: set()})
    is_first_entry = not domain_data[DATA_ENTRIES]
    domain_data[DATA_ENTRIES].add(entry.entry_id)

    if is_first_entry:
        _register_services(hass)
        await _async_register_static_path(hass)
        await panel_custom.async_register_panel(
            hass,
            webcomponent_name="broadlink-codes-panel",
            frontend_url_path=PANEL_URL_PATH,
            module_url=PANEL_JS_URL,
            sidebar_title="Broadlink Codes",
            sidebar_icon="mdi:remote",
            require_admin=True,
            config={},
        )

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    domain_data = hass.data.get(DOMAIN)
    if domain_data is None:
        return True

    domain_data[DATA_ENTRIES].discard(entry.entry_id)

    if not domain_data[DATA_ENTRIES]:
        for service in ALL_SERVICES:
            hass.services.async_remove(DOMAIN, service)
        try:
            from homeassistant.components import frontend

            frontend.async_remove_panel(hass, PANEL_URL_PATH)
        except Exception as err:  # noqa: BLE001 - best-effort cleanup only
            _LOGGER.debug("Could not remove sidebar panel cleanly: %s", err)
        hass.data.pop(DOMAIN, None)

    return True


def _register_services(hass: HomeAssistant) -> None:
    async def handle_list_codes(call: ServiceCall) -> dict:
        remotes = []
        for entity_id, entity in get_broadlink_remotes(hass):
            await async_ensure_storage_loaded(entity)
            state = getattr(hass, "states", None)
            state = state.get(entity_id) if state else None
            friendly_name = (
                (state.attributes.get("friendly_name") if state else None)
                or getattr(entity, "name", None)
                or entity_id
            )
            remotes.append(
                {
                    "entity_id": entity_id,
                    "friendly_name": friendly_name,
                    "devices": _codes_payload(entity),
                }
            )
        return {"remotes": remotes}

    async def handle_rename_command(call: ServiceCall) -> None:
        entity = get_remote_by_entity_id(hass, call.data["entity_id"])
        if entity is None:
            raise ValueError(f"Broadlink remote {call.data['entity_id']} not found")

        await async_ensure_storage_loaded(entity)

        device = call.data["device"]
        old_command = call.data["old_command"]
        new_command = call.data["new_command"]

        async def _do_rename() -> None:
            codes = entity._codes  # noqa: SLF001 - see entity_access.py
            if device not in codes or old_command not in codes[device]:
                raise ValueError(f"Command '{old_command}' not found on device '{device}'")
            if new_command in codes[device]:
                raise ValueError(f"'{new_command}' already exists on device '{device}'")
            codes[device][new_command] = codes[device].pop(old_command)
            await entity._code_storage.async_save(codes)  # noqa: SLF001

        lock = getattr(entity, "_lock", None)
        if lock is not None:
            async with lock:
                await _do_rename()
        else:
            await _do_rename()

    async def handle_learn_command(call: ServiceCall) -> dict:
        """Thin wrapper around remote.learn_command that reports the
        outcome back to the panel (the underlying service is
        fire-and-forget and returns nothing itself)."""
        try:
            await hass.services.async_call(
                "remote",
                "learn_command",
                {
                    "entity_id": call.data["entity_id"],
                    "device": call.data["device"],
                    "command": call.data["command"],
                    "alternative": call.data.get("alternative", False),
                    "timeout": call.data.get("timeout", 20),
                },
                blocking=True,
                context=call.context,
            )
            return {"status": "ok", "device": call.data["device"], "command": call.data["command"]}
        except Exception as err:  # noqa: BLE001 - surface learn failures/timeouts to the panel
            return {"status": "error", "error": str(err)}

    async def handle_copy_command(call: ServiceCall) -> None:
        """Copy one learned command onto another device - optionally on a
        different Broadlink remote entity entirely (codes aren't tied to a
        specific MAC/hardware, so this is a plain data copy)."""
        entity = get_remote_by_entity_id(hass, call.data["entity_id"])
        if entity is None:
            raise ValueError(f"Broadlink remote {call.data['entity_id']} not found")
        await async_ensure_storage_loaded(entity)

        target_entity_id = call.data.get("target_entity_id") or call.data["entity_id"]
        target_entity = get_remote_by_entity_id(hass, target_entity_id)
        if target_entity is None:
            raise ValueError(f"Broadlink remote {target_entity_id} not found")
        if target_entity is not entity:
            await async_ensure_storage_loaded(target_entity)

        device = call.data["device"]
        command = call.data["command"]
        target_device = call.data["target_device"]
        target_command = call.data.get("target_command") or command
        overwrite = call.data.get("overwrite", False)

        async def _do_copy() -> None:
            codes = entity._codes  # noqa: SLF001 - see entity_access.py
            if device not in codes or command not in codes[device]:
                raise ValueError(f"Command '{command}' not found on device '{device}'")
            value = codes[device][command]

            target_codes = target_entity._codes  # noqa: SLF001
            target_codes.setdefault(target_device, {})
            if not overwrite and target_command in target_codes[target_device]:
                raise ValueError(
                    f"'{target_command}' already exists on device '{target_device}' "
                    "(pass overwrite: true to replace it)"
                )
            # Copy by value (not reference) so editing one copy never mutates
            # the other - matters for toggle commands, whose value is a list.
            target_codes[target_device][target_command] = (
                list(value) if isinstance(value, list) else value
            )
            await target_entity._code_storage.async_save(target_codes)  # noqa: SLF001

        same_entity = target_entity is entity
        lock = getattr(entity, "_lock", None)
        target_lock = getattr(target_entity, "_lock", None)

        if same_entity:
            if lock is not None:
                async with lock:
                    await _do_copy()
            else:
                await _do_copy()
        elif lock is not None and target_lock is not None:
            # Two different entities -> two different locks. Acquire both,
            # source first, so this never races either entity's own
            # concurrent learn/rename/delete on the same device.
            async with lock:
                async with target_lock:
                    await _do_copy()
        elif lock is not None:
            async with lock:
                await _do_copy()
        elif target_lock is not None:
            async with target_lock:
                await _do_copy()
        else:
            await _do_copy()

    hass.services.async_register(
        DOMAIN, SERVICE_LIST_CODES, handle_list_codes, supports_response=SupportsResponse.ONLY
    )
    hass.services.async_register(
        DOMAIN, SERVICE_RENAME_COMMAND, handle_rename_command, schema=RENAME_SCHEMA
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_LEARN_COMMAND,
        handle_learn_command,
        schema=LEARN_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
    hass.services.async_register(
        DOMAIN, SERVICE_COPY_COMMAND, handle_copy_command, schema=COPY_SCHEMA
    )


async def _async_register_static_path(hass: HomeAssistant) -> None:
    """Serve the panel's JS file.

    HA's static-path API changed in 2024.7 (StaticPathConfig + async
    register). We try the modern API first and fall back to the older
    synchronous one so this keeps working across a range of HA versions.
    """
    js_path = hass.config.path(f"custom_components/{DOMAIN}/www/broadlink-codes-panel.js")

    try:
        from homeassistant.components.http import StaticPathConfig

        await hass.http.async_register_static_paths(
            [StaticPathConfig(PANEL_JS_URL, js_path, False)]
        )
        return
    except ImportError:
        pass
    except Exception as err:  # noqa: BLE001
        _LOGGER.debug("Modern static path registration failed, falling back: %s", err)

    hass.http.register_static_path(PANEL_JS_URL, js_path, cache_headers=False)
