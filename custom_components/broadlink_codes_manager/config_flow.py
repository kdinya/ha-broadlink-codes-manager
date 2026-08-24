"""Config flow for Broadlink Codes Manager.

No fields to fill in - the panel discovers Broadlink remotes on its own,
so setup is just "Add Integration -> Submit". Single instance only.
"""
from __future__ import annotations

from homeassistant import config_entries

from .const import DOMAIN


class BroadlinkCodesManagerConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Broadlink Codes Manager."""

    VERSION = 1

    async def async_step_user(self, user_input: dict | None = None):
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()

        if user_input is not None:
            return self.async_create_entry(title="Broadlink Codes Manager", data={})

        return self.async_show_form(step_id="user")
