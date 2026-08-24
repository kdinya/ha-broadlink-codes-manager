"""Constants for Broadlink Codes Manager."""

DOMAIN = "broadlink_codes_manager"

PANEL_URL_PATH = DOMAIN
PANEL_JS_URL = "/broadlink_codes_manager_files/broadlink-codes-panel.js"

SERVICE_LIST_CODES = "list_codes"
SERVICE_RENAME_COMMAND = "rename_command"
SERVICE_CONVERT_CODE = "convert_code"
SERVICE_LEARN_COMMAND = "learn_command"

# hass.data[DOMAIN] key holding the set of active config entry IDs, used to
# register services/panel once on the first entry and clean up on the last.
DATA_ENTRIES = "entries"
