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
        # Mimic what the real broadlink integration does: writes the
        # learned code straight into the entity's live _codes dict.
        remote._codes.setdefault(call.data["device"], {})[call.data["command"]] = "AABBCC"

    hass.services.async_register("remote", "learn_command", fake_remote_learn)

    result = await hass.services.async_call(
        DOMAIN,
        "learn_command",
        {"entity_id": "remote.a", "device": "TV", "command": "power"},
    )

    assert result == {
        "status": "ok",
        "device": "TV",
        "command": "power",
        "code": "AABBCC",
        "toggle": False,
    }
    assert calls[0]["entity_id"] == "remote.a"


async def test_learn_command_reports_toggle_list_code(hass_with_remotes, make_remote):
    remote = make_remote("remote.a", "A", {})
    hass = hass_with_remotes(remote)
    await _setup(hass)

    async def fake_remote_learn(call):
        remote._codes.setdefault(call.data["device"], {})[call.data["command"]] = ["AA", "BB"]

    hass.services.async_register("remote", "learn_command", fake_remote_learn)

    result = await hass.services.async_call(
        DOMAIN,
        "learn_command",
        {"entity_id": "remote.a", "device": "TV", "command": "mute"},
    )

    assert result["toggle"] is True
    assert result["code"] == "AA"  # first code in the toggle list, for preview


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


# ---- create_device ----


async def test_create_device_adds_empty_device_entry(hass_with_remotes, make_remote):
    remote = make_remote("remote.a", "A", {})
    hass = hass_with_remotes(remote)
    await _setup(hass)

    await hass.services.async_call(
        DOMAIN, "create_device", {"entity_id": "remote.a", "device": "TV"}
    )

    assert remote._codes == {"TV": {}}
    assert remote._code_storage.save_count == 1


async def test_create_device_rejects_existing_device(hass_with_remotes, make_remote):
    remote = make_remote("remote.a", "A", {"TV": {"power": "AABB"}})
    hass = hass_with_remotes(remote)
    await _setup(hass)

    with pytest.raises(ValueError, match="already exists"):
        await hass.services.async_call(
            DOMAIN, "create_device", {"entity_id": "remote.a", "device": "TV"}
        )
    # existing device untouched
    assert remote._codes == {"TV": {"power": "AABB"}}


async def test_create_device_stores_device_type(hass_with_remotes, make_remote):
    remote = make_remote("remote.a", "A", {})
    hass = hass_with_remotes(remote)
    await _setup(hass)

    await hass.services.async_call(
        DOMAIN,
        "create_device",
        {"entity_id": "remote.a", "device": "TV", "device_type": "tv"},
    )

    result = await hass.services.async_call(DOMAIN, "list_codes", {})
    assert result["remotes"][0]["device_types"] == {"TV": "tv"}


# ---- rename_device ----


async def test_rename_device_moves_all_commands(hass_with_remotes, make_remote):
    remote = make_remote(
        "remote.a", "A", {"TV": {"power": "AABB", "mute": "CCDD"}}
    )
    hass = hass_with_remotes(remote)
    await _setup(hass)

    await hass.services.async_call(
        DOMAIN,
        "rename_device",
        {"entity_id": "remote.a", "old_device": "TV", "new_device": "Living Room TV"},
    )

    assert "TV" not in remote._codes
    assert remote._codes["Living Room TV"] == {"power": "AABB", "mute": "CCDD"}


async def test_rename_device_rejects_unknown_source(hass_with_remotes, make_remote):
    remote = make_remote("remote.a", "A", {})
    hass = hass_with_remotes(remote)
    await _setup(hass)

    with pytest.raises(ValueError, match="not found"):
        await hass.services.async_call(
            DOMAIN,
            "rename_device",
            {"entity_id": "remote.a", "old_device": "TV", "new_device": "New TV"},
        )


async def test_rename_device_rejects_collision(hass_with_remotes, make_remote):
    remote = make_remote("remote.a", "A", {"TV": {}, "AC": {}})
    hass = hass_with_remotes(remote)
    await _setup(hass)

    with pytest.raises(ValueError, match="already exists"):
        await hass.services.async_call(
            DOMAIN,
            "rename_device",
            {"entity_id": "remote.a", "old_device": "TV", "new_device": "AC"},
        )


async def test_rename_device_carries_over_device_type(hass_with_remotes, make_remote):
    remote = make_remote("remote.a", "A", {"TV": {"power": "AABB"}})
    hass = hass_with_remotes(remote)
    await _setup(hass)

    await hass.services.async_call(
        DOMAIN,
        "set_device_type",
        {"entity_id": "remote.a", "device": "TV", "device_type": "tv"},
    )
    await hass.services.async_call(
        DOMAIN,
        "rename_device",
        {"entity_id": "remote.a", "old_device": "TV", "new_device": "Living Room TV"},
    )

    result = await hass.services.async_call(DOMAIN, "list_codes", {})
    assert result["remotes"][0]["device_types"] == {"Living Room TV": "tv"}


# ---- set_device_type ----


async def test_set_device_type_persists_and_lists(hass_with_remotes, make_remote):
    remote = make_remote("remote.a", "A", {"TV": {"power": "AABB"}})
    hass = hass_with_remotes(remote)
    await _setup(hass)

    await hass.services.async_call(
        DOMAIN,
        "set_device_type",
        {"entity_id": "remote.a", "device": "TV", "device_type": "tv"},
    )

    result = await hass.services.async_call(DOMAIN, "list_codes", {})
    assert result["remotes"][0]["device_types"] == {"TV": "tv"}


async def test_set_device_type_empty_clears_override(hass_with_remotes, make_remote):
    remote = make_remote("remote.a", "A", {"TV": {"power": "AABB"}})
    hass = hass_with_remotes(remote)
    await _setup(hass)

    await hass.services.async_call(
        DOMAIN,
        "set_device_type",
        {"entity_id": "remote.a", "device": "TV", "device_type": "tv"},
    )
    await hass.services.async_call(
        DOMAIN,
        "set_device_type",
        {"entity_id": "remote.a", "device": "TV", "device_type": ""},
    )

    result = await hass.services.async_call(DOMAIN, "list_codes", {})
    assert result["remotes"][0]["device_types"] == {}
