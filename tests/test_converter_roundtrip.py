"""Cross-format round-trip tests, via the hub-and-spoke ``convert()``
function: format A -> IRSignal -> format B -> IRSignal -> format A.

Every pair is lossy to a different degree (Broadlink quantizes to 32.84us
ticks, Pronto quantizes to a frequency-dependent tick, raw_us is exact),
so each pair gets its own tolerance instead of one blanket number.
"""
from __future__ import annotations

import json
from pathlib import Path

import pytest

from custom_components.broadlink_codes_manager.converter import FORMATS, convert, convert_all
from custom_components.broadlink_codes_manager.converter.model import IRSignal
from custom_components.broadlink_codes_manager.converter.broadlink import to_broadlink

FIXTURES = json.loads((Path(__file__).parent / "fixtures" / "sample_signals.json").read_text())

# (from_format, to_format): max allowed per-timing drift in microseconds
# after A -> B -> A.
PAIR_TOLERANCE = {
    ("raw_us", "broadlink_base64"): 34,
    ("broadlink_base64", "raw_us"): 34,
    ("raw_us", "pronto"): 40,
    ("pronto", "raw_us"): 40,
    ("broadlink_base64", "pronto"): 70,
    ("pronto", "broadlink_base64"): 70,
}


def _timings_of(code, fmt):
    return FORMATS[fmt]["parse"](code).timings


@pytest.mark.parametrize("name", list(FIXTURES.keys()))
@pytest.mark.parametrize("from_fmt,to_fmt", list(PAIR_TOLERANCE.keys()))
def test_cross_format_round_trip_within_tolerance(name, from_fmt, to_fmt):
    fixture = FIXTURES[name]
    original = IRSignal(timings=fixture["timings"], frequency=fixture["frequency"])

    # Start from a code in from_fmt, generated straight from the fixture
    # via the same format's own serializer, so we're testing the
    # converter's round trip - not re-deriving the fixture itself.
    start_code = FORMATS[from_fmt]["serialize"](original)
    mid_code = convert(start_code, from_fmt, to_fmt)
    end_code = convert(mid_code, to_fmt, from_fmt)

    start_timings = _timings_of(start_code, from_fmt)
    end_timings = _timings_of(end_code, from_fmt)

    tolerance = PAIR_TOLERANCE[(from_fmt, to_fmt)]
    assert len(start_timings) == len(end_timings)
    for i, (a, b) in enumerate(zip(start_timings, end_timings)):
        assert abs(a - b) <= tolerance, (
            f"[{name}] {from_fmt}->{to_fmt}->{from_fmt} timing[{i}]: {a} vs {b} "
            f"(tolerance {tolerance})"
        )


def test_convert_all_includes_every_other_format_and_meta():
    code = to_broadlink(IRSignal(timings=[9000, -4500, 560, -560], frequency=38000))
    results = convert_all(code, "broadlink_base64")

    assert set(results.keys()) == {"raw_us", "pronto", "_meta"}
    assert results["_meta"]["frequency_assumed"] == 38000
    assert results["_meta"]["pulse_count"] == 4
    assert len(results["_meta"]["caveats"]) >= 1


def test_convert_all_surfaces_per_format_errors_without_raising():
    # raw_us accepts almost anything, but pronto/broadlink parsers can
    # fail on foreign input - convert_all should report that as a
    # per-format error, not blow up the whole conversion.
    results = convert_all("[100, -100, 100]", "raw_us")
    assert "value" in results["broadlink_base64"] or "error" in results["broadlink_base64"]
    assert "value" in results["pronto"] or "error" in results["pronto"]


def test_convert_unknown_from_format_raises():
    with pytest.raises(ValueError, match="Unknown source format"):
        convert("[]", "nonexistent_format", "raw_us")


def test_convert_unknown_to_format_raises():
    with pytest.raises(ValueError, match="Unknown target format"):
        convert("[100, -100]", "raw_us", "nonexistent_format")
