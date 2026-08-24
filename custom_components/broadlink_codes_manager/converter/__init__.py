"""Hub-and-spoke IR code converter registry.

    [format A] -> parse -> IRSignal -> serialize -> [format B]

Adding a new format = one parse function + one serialize function
registered here. Nothing else in the converter needs to change.
"""
from __future__ import annotations

from .broadlink import parse_broadlink, to_broadlink
from .model import IRSignal
from .pronto import parse_pronto, to_pronto
from .raw_us import parse_raw, to_raw

FORMATS: dict[str, dict] = {
    "broadlink_base64": {
        "label": "Broadlink base64",
        "parse": parse_broadlink,
        "serialize": to_broadlink,
    },
    "raw_us": {
        "label": "Raw microseconds (ESPHome/Tasmota)",
        "parse": parse_raw,
        "serialize": to_raw,
    },
    "pronto": {
        "label": "Pronto hex",
        "parse": parse_pronto,
        "serialize": to_pronto,
    },
}


def convert(code: str, from_format: str, to_format: str) -> str:
    if from_format not in FORMATS:
        raise ValueError(f"Unknown source format: {from_format}")
    if to_format not in FORMATS:
        raise ValueError(f"Unknown target format: {to_format}")
    signal = FORMATS[from_format]["parse"](code)
    return FORMATS[to_format]["serialize"](signal)


def convert_all(code: str, from_format: str) -> dict:
    """Convert `code` into every other registered format.

    Returns {format_key: {"label": ..., "value": ...}} or
    {format_key: {"label": ..., "error": ...}} for formats that failed
    (e.g. an RF code fed into an IR-only parser).
    """
    if from_format not in FORMATS:
        raise ValueError(f"Unknown source format: {from_format}")

    signal = FORMATS[from_format]["parse"](code)
    results: dict[str, dict] = {}
    for key, fmt in FORMATS.items():
        if key == from_format:
            continue
        try:
            results[key] = {"label": fmt["label"], "value": fmt["serialize"](signal)}
        except Exception as err:  # noqa: BLE001 - surface any format-specific failure
            results[key] = {"label": fmt["label"], "error": str(err)}

    results["_meta"] = {
        "frequency_assumed": signal.frequency,
        "pulse_count": len(signal.timings),
        "caveats": [
            "Carrier frequency is assumed (38 kHz default), never read from the code itself.",
            "Repeat sequences are flattened into one continuous block in v1.",
            "IR only - RF (315/433 MHz) codes are not supported.",
        ],
    }
    return results


__all__ = ["FORMATS", "IRSignal", "convert", "convert_all"]
