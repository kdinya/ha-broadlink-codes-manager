"""Tests for converter/broadlink.py.

Broadlink's tick is 32.84us, so parse -> serialize -> parse is exact to
within one tick's rounding error (~33us) per timing value - that
tolerance is deliberate, not a bug, and these tests check it explicitly
rather than asserting bit-for-bit equality.
"""
from __future__ import annotations

import base64
import json
from pathlib import Path

import pytest

from custom_components.broadlink_codes_manager.converter.broadlink import (
    TICK_US,
    parse_broadlink,
    to_broadlink,
)
from custom_components.broadlink_codes_manager.converter.model import IRSignal

FIXTURES = json.loads((Path(__file__).parent / "fixtures" / "sample_signals.json").read_text())

# One Broadlink tick of rounding error is allowed per timing (both parse
# and serialize round to the nearest tick).
TOLERANCE_US = TICK_US * 1.5


def assert_timings_close(actual, expected, tolerance=TOLERANCE_US):
    assert len(actual) == len(expected), f"length mismatch: {len(actual)} vs {len(expected)}"
    for i, (a, e) in enumerate(zip(actual, expected)):
        assert abs(a - e) <= tolerance, f"timing[{i}]: {a} vs {e} (tolerance {tolerance})"


@pytest.mark.parametrize("name", list(FIXTURES.keys()))
def test_round_trip_timings_to_broadlink_and_back(name):
    fixture = FIXTURES[name]
    original = IRSignal(timings=fixture["timings"], frequency=fixture["frequency"])

    code = to_broadlink(original)
    parsed = parse_broadlink(code)

    assert_timings_close(parsed.timings, original.timings)
    assert parsed.frequency == 38000  # Broadlink codes always assume 38kHz


def test_to_broadlink_produces_valid_base64():
    signal = IRSignal(timings=[9000, -4500, 560, -560], frequency=38000)
    code = to_broadlink(signal)
    # Must decode cleanly and round-trip through padding.
    raw = base64.b64decode(code + "=" * (-len(code) % 4))
    assert raw[0] == 0x26  # IR packet type


def test_to_broadlink_sets_ir_packet_type_and_trailer():
    signal = IRSignal(timings=[100, -100], frequency=38000)
    code = to_broadlink(signal)
    raw = base64.b64decode(code)
    assert raw[0] == 0x26
    length = raw[2] | (raw[3] << 8)
    data = raw[4 : 4 + length]
    assert data[-2:] == b"\x0d\x05" or b"\x0d\x05" in data


def test_parse_broadlink_rejects_rf_packet_type():
    # Byte 0 = 0xb2 (RF, not IR) with a plausible-looking rest of the packet.
    raw = bytes([0xB2, 0x00, 0x04, 0x00, 0x0A, 0x0B, 0x0D, 0x05])
    code = base64.b64encode(raw).decode()
    with pytest.raises(ValueError, match="Unsupported packet type"):
        parse_broadlink(code)


def test_parse_broadlink_rejects_too_short_code():
    code = base64.b64encode(b"\x26\x00").decode()
    with pytest.raises(ValueError, match="too short"):
        parse_broadlink(code)


def test_parse_broadlink_handles_extended_length_ticks():
    # A duration >= 256 ticks is encoded as 0x00 + big-endian uint16.
    # 300 ticks * 32.84us ~= 9852us.
    signal = IRSignal(timings=[9852, -560], frequency=38000)
    code = to_broadlink(signal)
    parsed = parse_broadlink(code)
    assert_timings_close(parsed.timings, signal.timings, tolerance=TICK_US * 2)


def test_parse_then_serialize_is_stable_on_a_real_shaped_packet():
    # Regression check: running the round trip twice should converge
    # (second pass changes nothing further, beyond tick rounding already
    # applied on the first pass).
    fixture = FIXTURES["tv_power"]
    original = IRSignal(timings=fixture["timings"], frequency=fixture["frequency"])
    code1 = to_broadlink(original)
    parsed1 = parse_broadlink(code1)
    code2 = to_broadlink(parsed1)
    parsed2 = parse_broadlink(code2)
    assert_timings_close(parsed2.timings, parsed1.timings, tolerance=1)  # exact on 2nd pass
