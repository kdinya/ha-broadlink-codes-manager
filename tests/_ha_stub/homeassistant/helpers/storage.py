"""Minimal stand-in for ``homeassistant.helpers.storage.Store``.

Persists to an in-memory dict scoped to the fake ``hass`` instance (via
``hass.data``) instead of real file I/O - enough to exercise this
integration's own load/save logic without touching disk.
"""
from __future__ import annotations

_STUB_STORAGE_BUCKET = "_stub_storage"


class Store:
    def __init__(self, hass, version, key) -> None:
        self._hass = hass
        self._key = key

    async def async_load(self):
        bucket = self._hass.data.setdefault(_STUB_STORAGE_BUCKET, {})
        return bucket.get(self._key)

    async def async_save(self, data) -> None:
        bucket = self._hass.data.setdefault(_STUB_STORAGE_BUCKET, {})
        bucket[self._key] = data
