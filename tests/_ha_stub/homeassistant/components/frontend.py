from __future__ import annotations


def async_remove_panel(hass, url_path: str) -> None:
    panels = hass.data.get("_registered_panels", [])
    hass.data["_registered_panels"] = [
        p for p in panels if p.get("frontend_url_path") != url_path
    ]
