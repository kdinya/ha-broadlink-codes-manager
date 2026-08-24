"""Tests for the services registered by ``__init__.py``.

These exercise the service handlers directly through the fake ``hass``
(see conftest.py / _ha_stub) rather than through a real Home Assistant
service-call bus - the goal is pinning down this integration's own
logic (locking, "not found" errors, overwrite protection, toggle-list
handling), not re-testing Home Assistant itself.
"""
from __future__ import annotations

import pytest

from custom_components.broadlink_codes_manager import async_setup_entry
from custom_components.broadlink_codes_manager.const import DOMAIN


async def _setup(hass):
    from homeassistant.config_entries import ConfigEntry

    entry = ConfigEntry("test-entry")
    await async_setup_entry(hass, entry)
    return entry


async def test_list_codes_reports_toggle_vs_plain_commands(hass_with_remotes, make_remote):
    remote = make_remote(
        "remote.living_room",
        "Living Room Broadlink",
        {"TV": {"power": "AABB", "mute": ["AABB", "CCDD"]}},
    )
    hass = hass_with_remotes(remote)
    await _setup(hass)

    result = await hass.services.async_call(DOMAIN, "list_codes", {})

    devices = result["remotes"][0]["devices"]
    assert devices["TV"]["power"] == {"toggle": False, "codes": ["AABB"]}
    assert devices["TV"]["mute"] == {"toggle": True, "codes": ["AABB", "CCDD"]}


async def test_rename_command_moves_code_to_new_key(hass_with_remotes, make_remote):
    remote = make_remote("remote.a", "A", {"TV": {"power": "AABB"}})
    hass = hass_with_remotes(remote)
    await _setup(hass)

    await hass.services.async_call(
        DOMAIN,
        "rename_command",
        {"entity_id": "remote.a", "device": "TV", "old_command": "power", "new_command": "power_toggle"},
    )

    assert remote._codes == {"TV": {"power_toggle": "AABB"}}
    assert remote._code_storage.save_count == 1


async def test_rename_command_rejects_unknown_source(hass_with_remotes, make_remote):
    remote = make_remote("remote.a", "A", {"TV": {"power": "AABB"}})
    hass = hass_with_remotes(remote)
    await _setup(hass)

    with pytest.raises(ValueError, match="not found"):
        await hass.services.async_call(
            DOMAIN,
            "rename_command",
            {"entity_id": "remote.a", "device": "TV", "old_command": "nope", "new_command": "x"},
        )
    assert remote._code_storage.save_count == 0


async def test_rename_command_rejects_collision_with_existing_name(hass_with_remotes, make_remote):
    remote = make_remote("remote.a", "A", {"TV": {"power": "AABB", "mute": "CCDD"}})
    hass = hass_with_remotes(remote)
    await _setup(hass)

    with pytest.raises(ValueError, match="already exists"):
        await hass.services.async_call(
            DOMAIN,
            "rename_command",
            {"entity_id": "remote.a", "device": "TV", "old_command": "power", "new_command": "mute"},
        )


async def test_learn_command_reports_ok_status(hass_with_remotes, make_remote):
    remote = make_remote("remote.a", "A", {})
    hass = hass_with_remotes(remote)
    await _setup(hass)

    calls = []

    async def fake_remote_learn(call):
        calls.append(call.data)
        return {}

    hass.services.async_register("remote", "learn_command", fake_remote_learn)

    result = await hass.services.async_call(
        DOMAIN,
        "learn_command",
        {"entity_id": "remote.a", "device": "TV", "command": "power"},
    )

    assert result == {"status": "ok", "device": "TV", "command": "power"}
    assert calls[0]["entity_id"] == "remote.a"


async def test_learn_command_reports_error_status_on_failure(hass_with_remotes, make_remote):
    remote = make_remote("remote.a", "A", {})
    hass = hass_with_remotes(remote)
    await _setup(hass)

    async def failing_learn(call):
        raise TimeoutError("no signal received")

    hass.services.async_register("remote", "learn_command", failing_learn)

    result = await hass.services.async_call(
        DOMAIN,
        "learn_command",
        {"entity_id": "remote.a", "device": "TV", "command": "power"},
    )

    assert result["status"] == "error"
    assert "no signal received" in result["error"]


async def test_convert_code_service_delegates_to_converter(hass_with_remotes, make_remote):
    from custom_components.broadlink_codes_manager.converter import IRSignal, to_broadlink

    hass = hass_with_remotes(make_remote("remote.a", "A", {}))
    await _setup(hass)

    code = to_broadlink(IRSignal(timings=[9000, -4500, 560, -560, 560, -1690], frequency=38000))
    result = await hass.services.async_call(
        DOMAIN,
        "convert_code",
        {"code": code, "from_format": "broadlink_base64"},
    )

    assert "raw_us" in result["results"]
    assert "pronto" in result["results"]
    assert result["results"]["_meta"]["frequency_assumed"] == 38000


# ---- copy_command ----


async def test_copy_command_within_same_remote(hass_with_remotes, make_remote):
    remote = make_remote("remote.a", "A", {"TV": {"power": "AABB"}})
    hass = hass_with_remotes(remote)
    await _setup(hass)

    await hass.services.async_call(
        DOMAIN,
        "copy_command",
        {
            "entity_id": "remote.a",
            "device": "TV",
            "command": "power",
            "target_device": "TV2",
        },
    )

    assert remote._codes["TV"]["power"] == "AABB"  # source untouched
    assert remote._codes["TV2"]["power"] == "AABB"  # copied under same command name


async def test_copy_command_across_two_remotes(hass_with_remotes, make_remote):
    src = make_remote("remote.living_room", "Living Room", {"TV": {"power": "AABB"}})
    dst = make_remote("remote.bedroom", "Bedroom", {})
    hass = hass_with_remotes(src, dst)
    await _setup(hass)

    await hass.services.async_call(
        DOMAIN,
        "copy_command",
        {
            "entity_id": "remote.living_room",
            "device": "TV",
            "command": "power",
            "target_entity_id": "remote.bedroom",
            "target_device": "TV",
            "target_command": "power_btn",
        },
    )

    assert dst._codes["TV"]["power_btn"] == "AABB"
    assert dst._code_storage.save_count == 1
    assert src._code_storage.save_count == 0  # source store is never re-saved


async def test_copy_command_copies_toggle_lists_by_value_not_reference(hass_with_remotes, make_remote):
    remote = make_remote("remote.a", "A", {"TV": {"mute": ["AA", "BB"]}})
    hass = hass_with_remotes(remote)
    await _setup(hass)

    await hass.services.async_call(
        DOMAIN,
        "copy_command",
        {"entity_id": "remote.a", "device": "TV", "command": "mute", "target_device": "TV2"},
    )

    remote._codes["TV"]["mute"].append("CC")  # mutate the source afterwards
    assert remote._codes["TV2"]["mute"] == ["AA", "BB"]  # copy is unaffected


async def test_copy_command_rejects_overwrite_by_default(hass_with_remotes, make_remote):
    remote = make_remote("remote.a", "A", {"TV": {"power": "AABB"}, "TV2": {"power": "EXISTING"}})
    hass = hass_with_remotes(remote)
    await _setup(hass)

    with pytest.raises(ValueError, match="already exists"):
        await hass.services.async_call(
            DOMAIN,
            "copy_command",
            {"entity_id": "remote.a", "device": "TV", "command": "power", "target_device": "TV2"},
        )
    assert remote._codes["TV2"]["power"] == "EXISTING"


async def test_copy_command_overwrite_true_replaces_target(hass_with_remotes, make_remote):
    remote = make_remote("remote.a", "A", {"TV": {"power": "AABB"}, "TV2": {"power": "EXISTING"}})
    hass = hass_with_remotes(remote)
    await _setup(hass)

    await hass.services.async_call(
        DOMAIN,
        "copy_command",
        {
            "entity_id": "remote.a",
            "device": "TV",
            "command": "power",
            "target_device": "TV2",
            "overwrite": True,
        },
    )

    assert remote._codes["TV2"]["power"] == "AABB"


async def test_copy_command_rejects_unknown_source_command(hass_with_remotes, make_remote):
    remote = make_remote("remote.a", "A", {"TV": {}})
    hass = hass_with_remotes(remote)
    await _setup(hass)

    with pytest.raises(ValueError, match="not found"):
        await hass.services.async_call(
            DOMAIN,
            "copy_command",
            {"entity_id": "remote.a", "device": "TV", "command": "power", "target_device": "TV2"},
        )


async def test_copy_command_rejects_unknown_target_remote(hass_with_remotes, make_remote):
    remote = make_remote("remote.a", "A", {"TV": {"power": "AABB"}})
    hass = hass_with_remotes(remote)
    await _setup(hass)

    with pytest.raises(ValueError, match="not found"):
        await hass.services.async_call(
            DOMAIN,
            "copy_command",
            {
                "entity_id": "remote.a",
                "device": "TV",
                "command": "power",
                "target_entity_id": "remote.does_not_exist",
                "target_device": "TV",
            },
        )
