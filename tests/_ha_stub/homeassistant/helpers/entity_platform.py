from __future__ import annotations


def async_get_platforms(hass, integration_domain):
    """Return the fake platforms registered on ``hass`` for
    ``integration_domain`` (tests attach these to ``hass._platforms``)."""
    return [p for p in getattr(hass, "_platforms", []) if p.integration_domain == integration_domain]


class FakePlatform:
    def __init__(self, integration_domain: str, domain: str, entities: dict):
        self.integration_domain = integration_domain
        self.domain = domain
        self.entities = entities
