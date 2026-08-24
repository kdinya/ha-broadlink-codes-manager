"""Tests for converter/raw_us.py.

This format is a near pass-through (JSON array of signed microsecond
durations), so round trips through it should be *exact*, not just
tolerance-close - any drift here is a real bug, not rounding.
"""
from __future__ import annotations

import json
from pathlib import Path

import pytest

from custom_components.broadlink_codes_manager.converter.model import IRSignal
from custom_components.broadlink_codes_manager.converter.raw_us import parse_raw, to_raw

FIXTURES = json.loads((Path(__file__).parent / "fixtures" / "sample_signals.json").read_text())


@pytest.mark.parametrize("name", list(FIXTURES.keys()))
def test_round_trip_is_exact(name):
    fixture = FIXTURES[name]
    original = IRSignal(timings=fixture["timings"], frequency=fixture["frequency"])

    code = to_raw(original)
    parsed = parse_raw(code)

    assert parsed.timings == original.timings


def test_parse_raw_accepts_json_string():
    signal = parse_raw("[9000, -4500, 560, -560]")
    assert signal.timings == [9000, -4500, 560, -560]
    assert signal.frequency == 38000


def test_parse_raw_accepts_python_list_directly():
    signal = parse_raw([9000, -4500, 560, -560])
    assert signal.timings == [9000, -4500, 560, -560]


def test_parse_raw_coerces_floats_to_int():
    signal = parse_raw([9000.7, -4500.2])
    assert signal.timings == [9000, -4500]


def test_parse_raw_rejects_empty_array():
    with pytest.raises(ValueError, match="non-empty"):
        parse_raw("[]")


def test_parse_raw_rejects_non_array_json():
    with pytest.raises(ValueError, match="non-empty"):
        parse_raw('{"not": "an array"}')


def test_parse_raw_rejects_malformed_json():
    with pytest.raises(json.JSONDecodeError):
        parse_raw("[9000, -4500")


def test_to_raw_produces_valid_json():
    signal = IRSignal(timings=[1, -2, 3], frequency=38000)
    code = to_raw(signal)
    assert json.loads(code) == [1, -2, 3]
