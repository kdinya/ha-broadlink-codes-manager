"""Broadlink base64 IR packet <-> IRSignal.

Packet layout (unencrypted payload, as stored by Home Assistant and used
by python-broadlink and similar open-source clients):

  byte 0      : packet type, 0x26 for IR (0xb2 / 0xd7 are RF - unsupported)
  byte 1      : repeat count (ignored here, v1 flattens to one block)
  bytes 2-3   : little-endian uint16 length of the duration data
  bytes 4..   : duration data, then a 0x0d 0x05 trailer, zero-padded to a
                multiple of 16 bytes

Each duration is either:
  - a single byte (value = duration in "ticks"), or
  - 0x00 followed by a big-endian uint16 (for durations >= 256 ticks)

1 tick = 32.84 microseconds (Broadlink's clock is 32.84 kHz-ish; this is
the constant every open Broadlink client uses). Durations alternate
mark/space starting with a mark.
"""
from __future__ import annotations

import base64

from .model import IRSignal

TICK_US = 32.84
TRAILER = b"\x0d\x05"
IR_PACKET_TYPE = 0x26


def parse_broadlink(code: str) -> IRSignal:
    code = code.strip()
    padded = code + "=" * (-len(code) % 4)
    raw = base64.b64decode(padded)

    if len(raw) < 4:
        raise ValueError("Code too short to be a Broadlink IR packet")

    packet_type = raw[0]
    if packet_type != IR_PACKET_TYPE:
        raise ValueError(
            f"Unsupported packet type 0x{packet_type:02x}; only IR (0x26) "
            "is supported - RF codes are out of scope"
        )

    length = raw[2] | (raw[3] << 8)
    data = raw[4 : 4 + length]

    timings: list[int] = []
    is_pulse = True
    i = 0
    while i < len(data):
        # Trailer (0x0d 0x05) or zero padding after it marks end-of-signal.
        if data[i] == TRAILER[0] and i + 1 < len(data) and data[i + 1] == TRAILER[1]:
            break
        b = data[i]
        if b == 0x00:
            if i + 2 >= len(data):
                break
            ticks = (data[i + 1] << 8) | data[i + 2]
            i += 3
        else:
            ticks = b
            i += 1
        us = round(ticks * TICK_US)
        if us == 0:
            continue
        timings.append(us if is_pulse else -us)
        is_pulse = not is_pulse

    return IRSignal(timings=timings, frequency=38000)


def to_broadlink(signal: IRSignal) -> str:
    data = bytearray()
    for t in signal.timings:
        us = abs(t)
        ticks = max(1, round(us / TICK_US))
        if ticks < 256:
            data.append(ticks)
        else:
            data.append(0x00)
            data.append((ticks >> 8) & 0xFF)
            data.append(ticks & 0xFF)

    data += TRAILER
    pad = (-len(data)) % 16
    data += b"\x00" * pad

    length = len(data)
    packet = bytearray()
    packet.append(IR_PACKET_TYPE)
    packet.append(0x00)  # repeat count
    packet.append(length & 0xFF)
    packet.append((length >> 8) & 0xFF)
    packet += data

    return base64.b64encode(bytes(packet)).decode("ascii")
