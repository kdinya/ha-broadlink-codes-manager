"""Tests for entity_access.py.

This module is the one place that reaches into private BroadlinkRemote
attributes, so it's the one place a future HA release is most likely to
break silently. These tests pin down the *contract* it promises: missing
attributes degrade to "not found" rather than raising, storage is loaded
lazily and only once, and iter_devices() is a thin, faithful wrapper
around ``_codes``.
"""
from __future__ import annotations

import pytest

from custom_components.broadlink_codes_manager import entity_access


def test_get_broadlink_remotes_returns_entities_with_required_attrs(hass_with_remotes, make_remote):
    remote = make_remote("remote.living_room", "Living Room Broadlink", {"TV": {"power": "code"}})
    hass = hass_with_remotes(remote)

    found = entity_access.get_broadlink_remotes(hass)

    assert found == [("remote.living_room", remote)]


def test_get_broadlink_remotes_skips_entities_missing_private_attrs(hass_with_remotes, make_remote):
    remote = make_remote("remote.ok", "OK Remote", {})
    broken = make_remote("remote.broken", "Broken Remote", {})
    del broken._codes  # simulate a future HA release renaming/removing it
    hass = hass_with_remotes(remote, broken)

    found = entity_access.get_broadlink_remotes(hass)

    assert [eid for eid, _ in found] == ["remote.ok"]


def test_get_broadlink_remotes_ignores_non_remote_platforms(hass_with_remotes, make_remote):
    from homeassistant.helpers.entity_platform import FakePlatform

    remote = make_remote("remote.a", "A", {})
    hass = hass_with_remotes(remote)
    # A sensor platform under the same integration should never be returned.
    hass._platforms.append(FakePlatform("broadlink", "sensor", {"sensor.a": object()}))

    found = entity_access.get_broadlink_remotes(hass)

    assert [eid for eid, _ in found] == ["remote.a"]


def test_get_broadlink_remotes_empty_when_no_broadlink_platform(hass_with_remotes):
    hass = hass_with_remotes()

    assert entity_access.get_broadlink_remotes(hass) == []


def test_get_remote_by_entity_id_found_and_missing(hass_with_remotes, make_remote):
    remote = make_remote("remote.a", "A", {})
    hass = hass_with_remotes(remote)

    assert entity_access.get_remote_by_entity_id(hass, "remote.a") is remote
    assert entity_access.get_remote_by_entity_id(hass, "remote.nope") is None


@pytest.mark.asyncio
async def test_async_ensure_storage_loaded_loads_once_when_not_loaded(make_remote):
    remote = make_remote("remote.a", "A", {})
    remote._storage_loaded = False

    await entity_access.async_ensure_storage_loaded(remote)

    assert remote.load_calls == 1
    assert remote._storage_loaded is True


@pytest.mark.asyncio
async def test_async_ensure_storage_loaded_is_a_noop_when_already_loaded(make_remote):
    remote = make_remote("remote.a", "A", {})
    remote._storage_loaded = True

    await entity_access.async_ensure_storage_loaded(remote)

    assert remote.load_calls == 0


def test_iter_devices_reflects_codes_dict(make_remote):
    codes = {"TV": {"power": "code1"}, "AC": {"power": ["c1", "c2"]}}
    remote = make_remote("remote.a", "A", codes)

    assert dict(entity_access.iter_devices(remote)) == codes


def test_iter_devices_handles_missing_codes_attr_gracefully():
    class Bare:
        pass

    assert list(entity_access.iter_devices(Bare())) == []
