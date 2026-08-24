"""Shared pytest fixtures.

Puts the repo on sys.path so ``custom_components.broadlink_codes_manager``
is importable, and - only for the modules that need it
(test_services.py / test_entity_access.py) - installs a lightweight stub
of the ``homeassistant`` package into ``sys.modules`` *before* those
modules import it. The pure-logic tests (converters) never touch this
stub at all.
"""
from __future__ import annotations

import asyncio
import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parent.parent
STUB_ROOT = Path(__file__).resolve().parent / "_ha_stub"

for path in (str(REPO_ROOT), str(STUB_ROOT)):
    if path not in sys.path:
        sys.path.insert(0, path)


class FakeCodeStorage:
    """Stand-in for BroadlinkRemote's ``_code_storage`` (a
    ``homeassistant.helpers.storage.Store``) - just remembers the last
    value it was asked to persist."""

    def __init__(self) -> None:
        self.saved: dict | None = None
        self.save_count = 0

    async def async_save(self, data) -> None:
        self.saved = data
        self.save_count += 1


class FakeBroadlinkRemote:
    """Stand-in for ``homeassistant.components.broadlink.remote.BroadlinkRemote``
    exposing exactly the private attributes entity_access.py / __init__.py
    read: ``_codes``, ``_code_storage``, ``_lock``, ``_storage_loaded``."""

    def __init__(self, entity_id: str, name: str, codes: dict | None = None, use_lock: bool = True):
        self.entity_id = entity_id
        self.name = name
        self._codes = codes if codes is not None else {}
        self._code_storage = FakeCodeStorage()
        self._lock = asyncio.Lock() if use_lock else None
        self._storage_loaded = True
        self.load_calls = 0

    async def _async_load_storage(self) -> None:
        self.load_calls += 1
        self._storage_loaded = True


@pytest.fixture
def make_remote():
    """Factory fixture: make_remote(entity_id, name, codes) -> FakeBroadlinkRemote"""
    return FakeBroadlinkRemote


@pytest.fixture
def hass_with_remotes():
    """A fake hass wired up with one or more FakeBroadlinkRemote entities
    reachable via entity_access.get_broadlink_remotes(), the way
    entity_platform.async_get_platforms() would find real ones."""
    from homeassistant.core import HomeAssistant
    from homeassistant.helpers.entity_platform import FakePlatform

    def _build(*remotes: FakeBroadlinkRemote):
        hass = HomeAssistant()
        entities = {r.entity_id: r for r in remotes}
        hass._platforms = [FakePlatform("broadlink", "remote", entities)]
        return hass

    return _build
