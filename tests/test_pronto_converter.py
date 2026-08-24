"""Tests for converter/pronto.py."""
from __future__ import annotations

import json
from pathlib import Path

import pytest

from custom_components.broadlink_codes_manager.converter.model import IRSignal
from custom_components.broadlink_codes_manager.converter.pronto import (
    PRONTO_UNIT_CONST,
    parse_pronto,
    to_pronto,
)

FIXTURES = json.loads((Path(__file__).parent / "fixtures" / "sample_signals.json").read_text())

# Pronto ticks are frequency-dependent; one tick of rounding error at
# 38kHz is roughly 1e6/38000 * (1/PRONTO_UNIT_CONST ratio) -- generous
# fixed tolerance below covers double rounding (encode ticks, decode us).
TOLERANCE_US = 40


def assert_timings_close(actual, expected, tolerance=TOLERANCE_US):
    assert len(actual) == len(expected), f"length mismatch: {len(actual)} vs {len(expected)}"
    for i, (a, e) in enumerate(zip(actual, expected)):
        assert abs(a - e) <= tolerance, f"timing[{i}]: {a} vs {e} (tolerance {tolerance})"


@pytest.mark.parametrize("name", list(FIXTURES.keys()))
def test_round_trip_timings_to_pronto_and_back(name):
    fixture = FIXTURES[name]
    original = IRSignal(timings=fixture["timings"], frequency=fixture["frequency"])

    code = to_pronto(original)
    parsed = parse_pronto(code)

    assert_timings_close(parsed.timings, original.timings)
    assert abs(parsed.frequency - original.frequency) <= 200  # freq_code rounding


def test_to_pronto_produces_learned_format_header():
    signal = IRSignal(timings=[9000, -4500, 560, -560], frequency=38000)
    code = to_pronto(signal)
    words = code.split()
    assert words[0] == "0000"  # PRONTO_LEARNED_FORMAT
    assert len(words) == 4 + len(signal.timings)  # header(4) + one word per pulse/space


def test_to_pronto_computes_correct_frequency_code():
    signal = IRSignal(timings=[560, -560], frequency=38000)
    code = to_pronto(signal)
    freq_code = int(code.split()[1], 16)
    recovered_freq = round(1_000_000 / (freq_code * PRONTO_UNIT_CONST))
    assert abs(recovered_freq - 38000) < 50


def test_parse_pronto_rejects_non_learned_format():
    # format word 0100 = a "pre-defined" Pronto code, not raw/learned - unsupported.
    with pytest.raises(ValueError, match="format 0000"):
        parse_pronto("0100 006D 0022 0000 0015 0016")


def test_parse_pronto_rejects_zero_frequency_code():
    with pytest.raises(ValueError, match="frequency"):
        parse_pronto("0000 0000 0001 0000 0015 0016")


def test_parse_pronto_rejects_too_short_code():
    with pytest.raises(ValueError, match="too short"):
        parse_pronto("0000 006D")


def test_parse_pronto_known_frequency_code_matches_hand_calculation():
    # freq_code 0x6D (109) is the extremely common 38kHz Pronto value.
    code = "006D"
    freq_code = int(code, 16)
    expected_hz = round(1_000_000 / (freq_code * PRONTO_UNIT_CONST))
    assert abs(expected_hz - 38000) < 100


def test_to_pronto_pads_unmatched_trailing_mark_instead_of_dropping_it():
    # Regression test: a signal ending on a bare mark (odd timing count,
    # common for real learned IR codes with no recorded trailing gap)
    # must not silently lose that last mark during conversion.
    signal = IRSignal(timings=[9000, -4500, 560, -560, 560], frequency=38000)  # 5 values, odd

    code = to_pronto(signal)
    words = code.split()
    once_pair_count = int(words[2], 16)

    assert once_pair_count == 3  # 5 timings padded up to 3 pairs (6 values)
    parsed = parse_pronto(code)
    # The real data (first 5 values) must all still be present, unmodified
    # in count/order - only a synthetic trailing gap was appended after it.
    assert len(parsed.timings) == 6
    for original, recovered in zip(signal.timings, parsed.timings[:5]):
        assert abs(original - recovered) <= 40
    assert parsed.timings[5] < 0  # the synthetic padding is a gap (negative)
