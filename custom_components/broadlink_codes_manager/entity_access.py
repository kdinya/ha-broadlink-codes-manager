"""Safe, defensive access to live Broadlink `remote` entities.

The Broadlink integration in Home Assistant core does not expose a public
API for reading/writing learned codes outside of its own services. To read
codes without a second Store (and to write without racing HA's own
periodic Store flush), this module reaches into the *live* entity objects
that HA already created, via `entity_platform.async_get_platforms`.

This relies on private attributes (`_codes`, `_code_storage`, `_lock`,
`_storage_loaded`) of `homeassistant.components.broadlink.remote.BroadlinkRemote`.
Those are not a public/stable API and could change between HA releases
without a deprecation cycle. Every access here is guarded with `hasattr`
so that an incompatible HA version degrades to "no remotes found" (logged
clearly) instead of crashing.
"""
from __future__ import annotations

import logging
from typing import Any, Iterable

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_platform

_LOGGER = logging.getLogger(__name__)

REQUIRED_ATTRS = ("_codes", "_code_storage")

_warned_once = False


def get_broadlink_remotes(hass: HomeAssistant) -> list[tuple[str, Any]]:
    """Return (entity_id, entity) for every live Broadlink remote entity.

    Only entities that still expose the private attributes this component
    depends on are returned. If none do (e.g. Broadlink internals changed
    in a newer HA release), this returns an empty list and logs once.
    """
    global _warned_once
    remotes: list[tuple[str, Any]] = []
    found_any_platform = False

    for platform in entity_platform.async_get_platforms(hass, "broadlink"):
        if platform.domain != "remote":
            continue
        found_any_platform = True
        for entity_id, entity in platform.entities.items():
            if all(hasattr(entity, attr) for attr in REQUIRED_ATTRS):
                remotes.append((entity_id, entity))
            elif not _warned_once:
                _LOGGER.warning(
                    "Broadlink Codes Manager: entity %s does not expose the "
                    "expected internal attributes (%s). The Broadlink "
                    "integration's internals may have changed in this HA "
                    "version - please open an issue on "
                    "ha-broadlink-codes-manager.",
                    entity_id,
                    ", ".join(REQUIRED_ATTRS),
                )
                _warned_once = True

    if not found_any_platform and not _warned_once:
        _LOGGER.info(
            "Broadlink Codes Manager: no Broadlink `remote` platform is "
            "loaded yet. Make sure at least one Broadlink device is set up."
        )

    return remotes


def get_remote_by_entity_id(hass: HomeAssistant, entity_id: str) -> Any | None:
    for eid, entity in get_broadlink_remotes(hass):
        if eid == entity_id:
            return entity
    return None


async def async_ensure_storage_loaded(entity: Any) -> None:
    """Make sure the entity's codes have been loaded from disk."""
    if hasattr(entity, "_storage_loaded") and not entity._storage_loaded:  # noqa: SLF001
        loader = getattr(entity, "_async_load_storage", None)
        if callable(loader):
            await loader()


def iter_devices(entity: Any) -> Iterable[tuple[str, dict]]:
    codes = getattr(entity, "_codes", {}) or {}
    yield from codes.items()
