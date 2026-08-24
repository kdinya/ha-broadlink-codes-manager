from __future__ import annotations


class ConfigEntry:
    def __init__(self, entry_id: str = "test-entry") -> None:
        self.entry_id = entry_id


class ConfigFlow:
    """Accepts the ``domain=`` class kwarg used by
    ``config_flow.py``'s ``class Foo(config_entries.ConfigFlow, domain=...)``."""

    def __init_subclass__(cls, domain: str | None = None, **kwargs) -> None:
        super().__init_subclass__(**kwargs)
        cls.domain = domain
