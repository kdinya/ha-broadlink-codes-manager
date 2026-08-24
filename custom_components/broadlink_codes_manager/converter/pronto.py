"""Philips Pronto hex <-> IRSignal.

Only the "raw/learned" Pronto format (leading word 0000) is supported.
Layout: format(0000) freq_code once_pair_count repeat_pair_count
        <once pairs...> <repeat pairs...>  (each pair = mark, space, in
        Pronto ticks)

frequency_hz = 1_000_000 / (freq_code * 0.241246)

v1 concatenates the "once" and "repeat" sequences into a single block
(see IRSignal docstring) rather than modelling them separately - accurate
enough for the common AC-remote use case this tool targets.
"""
from __future__ import annotations

from .model import IRSignal

PRONTO_LEARNED_FORMAT = 0x0000
PRONTO_UNIT_CONST = 0.241246  # microseconds per Pronto tick, per freq_code=1

# Pronto's raw/learned layout is strictly (mark, space) pairs - it has no
# way to represent a trailing, unmatched mark. Real learned IR signals
# commonly end exactly that way (a final burst with no explicit trailing
# gap recorded). Rather than silently dropping that last mark, pad it
# with this synthetic trailing gap so no data is lost on conversion.
DEFAULT_TRAILING_GAP_US = 100_000


def parse_pronto(code: str) -> IRSignal:
    words = [int(w, 16) for w in code.strip().split()]
    if len(words) < 4:
        raise ValueError("Pronto code too short")

    format_code, freq_code, once_len, repeat_len = words[0:4]
    if format_code != PRONTO_LEARNED_FORMAT:
        raise ValueError(
            f"Only raw/learned Pronto codes (format 0000) are supported, "
            f"got format {format_code:04x}"
        )
    if freq_code == 0:
        raise ValueError("Pronto code has an invalid (zero) frequency code")

    frequency = round(1_000_000 / (freq_code * PRONTO_UNIT_CONST))
    pairs = words[4:]
    total_pairs = once_len + repeat_len

    timings: list[int] = []
    is_pulse = True
    for i in range(min(total_pairs * 2, len(pairs))):
        ticks = pairs[i]
        us = round(ticks * 1_000_000 / frequency)
        timings.append(us if is_pulse else -us)
        is_pulse = not is_pulse

    return IRSignal(timings=timings, frequency=frequency)


def to_pronto(signal: IRSignal) -> str:
    frequency = signal.frequency or 38000
    freq_code = round(1_000_000 / (frequency * PRONTO_UNIT_CONST))

    timings = list(signal.timings)
    if len(timings) % 2 != 0:
        # Unmatched trailing mark - pad with a synthetic gap instead of
        # silently dropping it (see DEFAULT_TRAILING_GAP_US above).
        timings.append(-DEFAULT_TRAILING_GAP_US)
    pair_count = len(timings) // 2

    words = [PRONTO_LEARNED_FORMAT, freq_code, pair_count, 0x0000]
    for t in timings:
        ticks = max(1, round(abs(t) * frequency / 1_000_000))
        words.append(ticks)

    return " ".join(f"{w:04X}" for w in words)
