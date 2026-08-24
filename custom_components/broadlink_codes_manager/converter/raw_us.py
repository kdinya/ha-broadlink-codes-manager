"""Raw microsecond timing arrays, ESPHome/Tasmota style: [9000,-4500,560,...].

Positive = mark, negative = space, same sign convention as IRSignal, so
this format is effectively a pass-through with JSON (de)serialization.
"""
from __future__ import annotations

import json

from .model import IRSignal


def parse_raw(code: str | list) -> IRSignal:
    if isinstance(code, str):
        values = json.loads(code)
    else:
        values = code
    if not isinstance(values, list) or not values:
        raise ValueError("Raw code must be a non-empty array of integers")
    return IRSignal(timings=[int(v) for v in values], frequency=38000)


def to_raw(signal: IRSignal) -> str:
    return json.dumps(list(signal.timings))
