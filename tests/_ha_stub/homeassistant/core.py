from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Callable


class SupportsResponse:
    NONE = "none"
    ONLY = "only"
    OPTIONAL = "optional"


@dataclass
class ServiceCall:
    data: dict = field(default_factory=dict)
    context: Any = None


@dataclass
class _RegisteredService:
    handler: Callable
    schema: Any = None
    supports_response: str = SupportsResponse.NONE


class FakeServices:
    """Stand-in for ``hass.services`` - registers and dispatches by
    (domain, service) instead of talking to a real event bus."""

    def __init__(self) -> None:
        self._registry: dict[tuple[str, str], _RegisteredService] = {}

    def async_register(self, domain, service, handler, schema=None, supports_response=None):
        self._registry[(domain, service)] = _RegisteredService(
            handler=handler,
            schema=schema,
            supports_response=supports_response or SupportsResponse.NONE,
        )

    def async_remove(self, domain, service):
        self._registry.pop((domain, service), None)

    def has_service(self, domain, service) -> bool:
        return (domain, service) in self._registry

    async def async_call(self, domain, service, data=None, blocking=True, context=None):
        entry = self._registry.get((domain, service))
        if entry is None:
            raise ValueError(f"Unknown service {domain}.{service}")
        call = ServiceCall(data=data or {}, context=context)
        return await entry.handler(call)


class HomeAssistant:
    """Bare-bones stand-in for HA's HomeAssistant object - just enough
    surface (``.data``, ``.services``) for this integration's setup and
    service-registration code to run against."""

    def __init__(self) -> None:
        self.data: dict = {}
        self.services = FakeServices()
        self.http = _FakeHttp()
        self.config = _FakeConfig()


class _FakeConfig:
    def path(self, *parts: str) -> str:
        return "/".join(parts)


class _FakeHttp:
    """No-op static-path registration - the panel worked with real static
    file serving, this just records that it was asked to."""

    def __init__(self) -> None:
        self.registered_paths: list = []

    async def async_register_static_paths(self, configs) -> None:
        self.registered_paths.extend(configs)

    def register_static_path(self, url_path, path, cache_headers=True) -> None:
        self.registered_paths.append((url_path, path))
