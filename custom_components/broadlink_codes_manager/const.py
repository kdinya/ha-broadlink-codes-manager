"""Constants for Broadlink Codes Manager."""

DOMAIN = "broadlink_codes_manager"

PANEL_URL_PATH = DOMAIN
PANEL_JS_URL = "/broadlink_codes_manager_files/broadlink-codes-panel.js"

SERVICE_LIST_CODES = "list_codes"
SERVICE_RENAME_COMMAND = "rename_command"
SERVICE_LEARN_COMMAND = "learn_command"
SERVICE_COPY_COMMAND = "copy_command"
SERVICE_RENAME_DEVICE = "rename_device"
SERVICE_SET_DEVICE_TYPE = "set_device_type"
SERVICE_CREATE_DEVICE = "create_device"
SERVICE_DELETE_DEVICE = "delete_device"

# hass.data[DOMAIN] key holding the set of active config entry IDs, used to
# register services/panel once on the first entry and clean up on the last.
DATA_ENTRIES = "entries"

# Storage for the panel's own device-type choices (used to pick an icon),
# separate from Broadlink's own code storage, which has no field for this.
DEVICE_TYPES_STORAGE_VERSION = 1
DEVICE_TYPES_STORAGE_KEY = f"{DOMAIN}_device_types"

# Kept in sync with the DEVICE_TYPES table in the panel's JS - the set of
# recognized device-type keys a device can be tagged with. "" means no
# explicit type was chosen (the panel falls back to guessing one from the
# device's name).
DEVICE_TYPE_KEYS = (
    "",
    "tv",
    "set_top_box",
    "projector",
    "air_conditioner",
    "fan",
    "ceiling_fan",
    "heater",
    "fireplace",
    "humidifier",
    "dehumidifier",
    "air_purifier",
    "light",
    "speaker",
    "soundbar",
    "receiver",
    "curtain",
    "garage_door",
    "door_lock",
    "camera",
    "doorbell",
    "robot_vacuum",
    "washing_machine",
    "dryer",
    "dishwasher",
    "oven",
    "microwave",
    "refrigerator",
    "kettle",
    "coffee_maker",
    "water_heater",
    "pool_pump",
    "lawn_mower",
    "generic",
)
