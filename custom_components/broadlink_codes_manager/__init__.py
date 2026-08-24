"""Broadlink Codes Manager.

A maintenance panel for the codes learned by Home Assistant's Broadlink
`remote` entities: browse, test, copy, rename, delete, convert between IR
code formats, and learn new commands - without touching
`.storage/broadlink_remote_<mac>_codes` by hand.

Setup is YAML-only (no config entry needed): add `broadlink_codes_manager:`
to configuration.yaml.
"""
from __future__ import annotations

import logging

import voluptuous as vol

from homeassistant.components import panel_custom
from homeassistant.core import HomeAssistant, ServiceCall, SupportsResponse
from homeassistant.helpers import config_validation as cv

from .const import (
    DOMAIN,
    PANEL_JS_URL,
    PANEL_URL_PATH,
    SERVICE_CONVERT_CODE,
    SERVICE_LEARN_COMMAND,
    SERVICE_LIST_CODES,
    SERVICE_RENAME_COMMAND,
)
from .converter import FORMATS, convert_all
from .entity_access import (
    async_ensure_storage_loaded,
    get_broadlink_remotes,
    get_remote_by_entity_id,
    iter_devices,
)

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.empty_config_schema(DOMAIN)

RENAME_SCHEMA = vol.Schema(
    {
        vol.Required("entity_id"): cv.entity_id,
        vol.Required("device"): str,
        vol.Required("old_command"): str,
        vol.Required("new_command"): str,
    }
)

CONVERT_SCHEMA = vol.Schema(
    {
        vol.Required("code"): str,
        vol.Required("from_format"): vol.In(list(FORMATS.keys())),
    }
)

LEARN_SCHEMA = vol.Schema(
    {
        vol.Required("entity_id"): cv.entity_id,
        vol.Required("device"): str,
        vol.Required("command"): str,
        vol.Optional("alternative", default=False): bool,
        vol.Optional("timeout", default=20): vol.All(int, vol.Range(min=5, max=60)),
    }
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


async def async_setup(hass: HomeAssistant, config) -> bool:
    async def handle_list_codes(call: ServiceCall) -> dict:
        remotes = []
        for entity_id, entity in get_broadlink_remotes(hass):
            await async_ensure_storage_loaded(entity)
            remotes.append(
                {
                    "entity_id": entity_id,
                    "friendly_name": getattr(entity, "name", entity_id),
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

    async def handle_convert_code(call: ServiceCall) -> dict:
        return {"results": convert_all(call.data["code"], call.data["from_format"])}

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

    hass.services.async_register(
        DOMAIN, SERVICE_LIST_CODES, handle_list_codes, supports_response=SupportsResponse.ONLY
    )
    hass.services.async_register(
        DOMAIN, SERVICE_RENAME_COMMAND, handle_rename_command, schema=RENAME_SCHEMA
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_CONVERT_CODE,
        handle_convert_code,
        schema=CONVERT_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_LEARN_COMMAND,
        handle_learn_command,
        schema=LEARN_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )

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
