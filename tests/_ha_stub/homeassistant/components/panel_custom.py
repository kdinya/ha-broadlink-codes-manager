from __future__ import annotations


async def async_register_panel(hass, **kwargs):
    hass.data.setdefault("_registered_panels", []).append(kwargs)
