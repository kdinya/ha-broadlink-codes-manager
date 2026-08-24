"""Shared internal representation for the IR code converter.

Hub-and-spoke design: every format has a `parse(code) -> IRSignal` and a
`serialize(signal) -> code`. Adding a new format never touches existing
parsers/serializers.
"""
from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class IRSignal:
    """Raw IR timings in microseconds (positive = mark/pulse, negative =
    space/gap), plus the assumed carrier frequency in Hz.

    Caveats that MUST surface in the UI, not be silently hidden:
    - Broadlink codes never carry a true carrier frequency; 38000 Hz is
      assumed (correct for the large majority of consumer IR gear, not a
      guarantee for exotic equipment).
    - Repeat sequences (e.g. Pronto's separate "once"/"repeat" blocks) are
      collapsed into a single continuous block in v1.
    - IR only. RF (315/433 MHz) is a different physical layer and is
      intentionally out of scope.
    """

    timings: list[int] = field(default_factory=list)
    frequency: int = 38000
    is_toggle: bool = False
    toggle_pair_timings: list[int] | None = None
