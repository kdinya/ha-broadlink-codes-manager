# Broadlink Codes Manager

A sidebar panel for Home Assistant to browse, test, copy, rename, delete,
convert and learn Broadlink IR/RF codes — without editing
`.storage/broadlink_remote_<mac>_codes` by hand.

> **Status: v1.1.0.** Built from a design spec and a review of the
> Broadlink integration's source in `home-assistant/core`, but **not yet
> tested against a live Home Assistant instance.** Please open an issue
> with your HA version if something doesn't load — see
> [Known limitations](#known-limitations--how-it-works) below for why.

## Features

- Sidebar panel (admin-only), not a Lovelace card — this is a
  maintenance tool, it needs room for a table and bulk actions.
- Per remote → per device → command table: **Test**, **Copy**,
  **Rename**, **Delete**, **Convert**.
- **Delete device** — removes every command on a device in one call.
- **Learn command** — create a new device and/or learn a new command
  from the panel (wraps `remote.learn_command`, reports success/failure
  back instead of leaving you guessing).
- **Convert** — turn any Broadlink base64 code into raw microsecond
  arrays (ESPHome/Tasmota style) or Pronto hex, and back. Built
  hub-and-spoke (`format → IRSignal → format`), so adding a new format
  is one parser + one serializer, not a rewrite.
- Filter/search across devices and commands.
- Toggle commands (learned with `alternative=True`) are labelled, not
  silently treated as plain commands.

## Installation

No YAML editing at any point — this is a UI-only integration.

### HACS (custom repository)

1. HACS → Integrations → ⋮ → Custom repositories.
2. Add `https://github.com/kdinya/ha-broadlink-codes-manager`, category
   *Integration*.
3. Install **Broadlink Codes Manager**, restart Home Assistant.
4. Settings → Devices & Services → **Add Integration** → search
   *Broadlink Codes Manager* → Submit. That's it — one instance is all
   that's needed, and it takes no configuration fields.
5. A **Broadlink Codes** entry appears in the sidebar for admin users.

### Manual

Copy `custom_components/broadlink_codes_manager/` into your HA
`config/custom_components/` folder, restart HA, then do step 4 above.

## Services

| Service | Purpose |
|---|---|
| `broadlink_codes_manager.list_codes` | Returns all remotes + codes (response data). Used by the panel. |
| `broadlink_codes_manager.rename_command` | Rename a command in place, no re-learning. |
| `broadlink_codes_manager.convert_code` | Convert one code into every other supported format. |
| `broadlink_codes_manager.learn_command` | Wraps `remote.learn_command` with a response so you know if it actually worked. |

Deleting and sending codes reuse Home Assistant's own
`remote.delete_command` / `remote.send_command` — no point reinventing
those.

## Known limitations & how it works

- **Reads/writes go through the live `BroadlinkRemote` entity object**
  (via `homeassistant.helpers.entity_platform`), not a second `Store`
  pointed at the same file. That avoids the race where HA's own
  periodic flush could clobber a concurrent direct file write. The
  trade-off: this relies on the entity's private attributes (`_codes`,
  `_code_storage`, `_lock`). Those are stable in practice but **not a
  public API**, and could change in a future HA release without a
  deprecation notice. If that happens, the panel will show "no Broadlink
  remotes found" and the log will explain why — it won't crash silently.
- **Carrier frequency** in Broadlink codes is never actually known;
  every conversion assumes 38 kHz. Correct for the vast majority of
  consumer IR gear, not guaranteed for exotic equipment. The converter
  surfaces this assumption in its output rather than hiding it.
- **Repeat sequences** (e.g. Pronto's separate "once"/"repeat" blocks)
  are flattened into one continuous block in v1. Fine for typical
  AC/TV remotes.
- **IR only.** RF (315/433 MHz) codes are a different physical layer and
  are intentionally out of scope.
- The panel's static file is served via `hass.http.register_static_path`
  (with a fallback to the newer `async_register_static_paths` /
  `StaticPathConfig` API introduced in HA 2024.7) — this code path is
  the least tested part of the integration; please report if the panel
  doesn't appear.

## Changelog

### v1.1.1

- Fixed the "Copy" button silently failing on setups where the
  `navigator.clipboard` API is unavailable (e.g. plain-HTTP access to
  Home Assistant, which has no secure-context clipboard access) — now
  falls back to a hidden-textarea + `execCommand("copy")` approach.
- Replaced every browser-native `confirm()` / `prompt()` / `alert()`
  popup (delete command, delete device, rename, learn command, convert
  result) with in-panel modal dialogs styled to match Home Assistant.
- Added a language selector to the panel, with Ukrainian (Українська)
  alongside English; the config-flow dialog is now also translated.
- General UI polish: card-style layout, collapsible device rows with a
  chevron indicator, escaped HTML in all user-supplied names to avoid
  markup injection in the panel.
- Confirmed (and documented) that there is intentionally no
  "add device" flow — devices are created implicitly the first time
  you learn a command on a new device name.

## Roadmap (deliberately not in v1.0.0)

- Export/import full backup as JSON, one click.
- Cross-remote code copy (codes aren't tied to a specific MAC).
- Duplicate-code highlighting.
- Support for the ESPHome `text.set_value` custom encoding some users
  use — parked because the exact format is unconfirmed; two encoding
  hypotheses were checked against a real sample and neither matched.
  Needs the source of the specific ESPHome component before it can be
  built.

## Contributing

Issues and PRs welcome, especially real-world testing reports (HA
version + what broke) since this was built and reviewed against source
but not yet run live.

## License

MIT — see [LICENSE](LICENSE).
