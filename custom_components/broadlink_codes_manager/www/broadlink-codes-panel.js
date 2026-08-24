// Broadlink Codes Manager - sidebar panel.
// Plain Web Component, no build step / no external deps, so it can be
// served as a single static file by panel_custom.

const DOMAIN = "broadlink_codes_manager";

class BroadlinkCodesPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._data = null;
    this._filter = "";
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._data) {
      this._load();
    }
  }

  get hass() {
    return this._hass;
  }

  async _callService(service, data, wantsResponse) {
    return this._hass.connection.sendMessagePromise({
      type: "call_service",
      domain: DOMAIN,
      service,
      service_data: data || {},
      return_response: !!wantsResponse,
    });
  }

  async _load() {
    try {
      const result = await this._callService("list_codes", {}, true);
      this._data = (result && result.response && result.response.remotes) || [];
    } catch (err) {
      this._error = err.message || String(err);
      this._data = [];
    }
    this._render();
  }

  async _refresh() {
    this._data = null;
    this._render();
    await this._load();
  }

  _toast(message, isError) {
    const el = this.shadowRoot.getElementById("toast");
    if (!el) return;
    el.textContent = message;
    el.className = isError ? "toast error show" : "toast show";
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      el.className = "toast";
    }, 3500);
  }

  async _testCommand(entityId, device, command) {
    try {
      await this._hass.callService("remote", "send_command", {
        entity_id: entityId,
        device,
        command,
      });
      this._toast(`Sent "${command}"`);
    } catch (err) {
      this._toast(`Send failed: ${err.message || err}`, true);
    }
  }

  async _deleteCommand(entityId, device, command) {
    if (!confirm(`Delete command "${command}" on "${device}"?`)) return;
    try {
      await this._hass.callService("remote", "delete_command", {
        entity_id: entityId,
        device,
        command,
      });
      this._toast(`Deleted "${command}"`);
      await this._refresh();
    } catch (err) {
      this._toast(`Delete failed: ${err.message || err}`, true);
    }
  }

  async _deleteDevice(entityId, device, commands) {
    const names = Object.keys(commands);
    if (!confirm(`Delete ALL ${names.length} commands on device "${device}"? This removes the whole device.`)) {
      return;
    }
    try {
      await this._hass.callService("remote", "delete_command", {
        entity_id: entityId,
        device,
        command: names,
      });
      this._toast(`Deleted device "${device}"`);
      await this._refresh();
    } catch (err) {
      this._toast(`Delete failed: ${err.message || err}`, true);
    }
  }

  async _renameCommand(entityId, device, oldName) {
    const newName = prompt(`New name for "${oldName}"`, oldName);
    if (!newName || newName === oldName) return;
    try {
      await this._callService("rename_command", {
        entity_id: entityId,
        device,
        old_command: oldName,
        new_command: newName,
      });
      this._toast(`Renamed to "${newName}"`);
      await this._refresh();
    } catch (err) {
      this._toast(`Rename failed: ${err.message || err}`, true);
    }
  }

  async _copyCode(code) {
    try {
      await navigator.clipboard.writeText(code);
      this._toast("Copied to clipboard");
    } catch (err) {
      this._toast("Copy failed - clipboard permission denied", true);
    }
  }

  async _learnCommand(entityId) {
    const device = prompt("Device name (new or existing):");
    if (!device) return;
    const command = prompt("Command name:");
    if (!command) return;
    this._toast(`Learning "${command}" - press the remote button now...`);
    try {
      const result = await this._callService(
        "learn_command",
        { entity_id: entityId, device, command, timeout: 20 },
        true
      );
      const resp = result && result.response;
      if (resp && resp.status === "ok") {
        this._toast(`Learned "${command}" on "${device}"`);
        await this._refresh();
      } else {
        this._toast(`Learn failed: ${(resp && resp.error) || "unknown error"}`, true);
      }
    } catch (err) {
      this._toast(`Learn failed: ${err.message || err}`, true);
    }
  }

  async _showConverter(code) {
    let results;
    try {
      const result = await this._callService(
        "convert_code",
        { code, from_format: "broadlink_base64" },
        true
      );
      results = result && result.response && result.response.results;
    } catch (err) {
      this._toast(`Conversion failed: ${err.message || err}`, true);
      return;
    }
    if (!results) return;

    const meta = results._meta || {};
    const lines = [];
    for (const key of Object.keys(results)) {
      if (key === "_meta") continue;
      const r = results[key];
      lines.push(`\n--- ${r.label} ---\n${r.value || "ERROR: " + r.error}`);
    }
    const caveats = (meta.caveats || []).map((c) => `  - ${c}`).join("\n");
    alert(
      `Converted (assumed carrier ${meta.frequency_assumed || "?"} Hz, ` +
        `${meta.pulse_count || "?"} pulses):\n${lines.join("\n")}\n\nCaveats:\n${caveats}`
    );
  }

  _render() {
    const root = this.shadowRoot;
    root.innerHTML = `
      <style>
        :host { display: block; padding: 16px; font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif); }
        h1 { font-size: 20px; margin: 0 0 4px; }
        .sub { color: var(--secondary-text-color); margin-bottom: 16px; font-size: 13px; }
        input.filter { width: 100%; max-width: 360px; padding: 8px; margin-bottom: 16px;
          border-radius: 4px; border: 1px solid var(--divider-color); box-sizing: border-box; }
        .remote { margin-bottom: 24px; border: 1px solid var(--divider-color); border-radius: 8px; overflow: hidden; }
        .remote-header { background: var(--secondary-background-color); padding: 10px 14px; font-weight: 500;
          display: flex; justify-content: space-between; align-items: center; }
        .device { border-top: 1px solid var(--divider-color); }
        .device-header { display: flex; justify-content: space-between; align-items: center;
          padding: 8px 14px; cursor: pointer; background: var(--card-background-color); }
        .device-header:hover { background: var(--secondary-background-color); }
        .device-actions button, .remote-header button { font-size: 12px; margin-left: 6px; }
        table { width: 100%; border-collapse: collapse; }
        td, th { padding: 6px 14px; text-align: left; font-size: 13px; border-top: 1px solid var(--divider-color); }
        code.preview { font-family: monospace; color: var(--secondary-text-color); }
        button { cursor: pointer; border: none; background: var(--primary-color); color: var(--text-primary-color, #fff);
          padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 4px; }
        button.ghost { background: transparent; color: var(--primary-color); border: 1px solid var(--primary-color); }
        button.danger { background: var(--error-color, #db4437); }
        .toggle-badge { font-size: 10px; background: var(--accent-color); color: #fff; border-radius: 3px; padding: 1px 4px; margin-left: 6px; }
        .empty { color: var(--secondary-text-color); padding: 24px 0; }
        .toast { position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%);
          background: var(--primary-text-color); color: var(--primary-background-color);
          padding: 10px 16px; border-radius: 6px; opacity: 0; pointer-events: none; transition: opacity .2s; font-size: 13px; }
        .toast.show { opacity: 0.95; }
        .toast.error { background: var(--error-color, #db4437); color: #fff; }
      </style>
      <h1>Broadlink Codes Manager</h1>
      <div class="sub">Browse, test, copy, rename, delete and convert learned IR codes.</div>
      <input class="filter" type="search" placeholder="Filter by device or command..." />
      <div id="content"></div>
      <div id="toast" class="toast"></div>
    `;

    const filterInput = root.querySelector("input.filter");
    filterInput.value = this._filter;
    filterInput.addEventListener("input", (e) => {
      this._filter = e.target.value.toLowerCase();
      this._renderContent();
    });

    this._renderContent();
  }

  _renderContent() {
    const content = this.shadowRoot.getElementById("content");
    if (!content) return;

    if (this._data === null) {
      content.innerHTML = `<div class="empty">Loading...</div>`;
      return;
    }
    if (this._error) {
      content.innerHTML = `<div class="empty">Error loading codes: ${this._error}</div>`;
      return;
    }
    if (!this._data.length) {
      content.innerHTML = `<div class="empty">No Broadlink remote entities found. Make sure a Broadlink device is set up in Home Assistant.</div>`;
      return;
    }

    const filter = this._filter;
    content.innerHTML = "";

    for (const remote of this._data) {
      const remoteEl = document.createElement("div");
      remoteEl.className = "remote";

      const header = document.createElement("div");
      header.className = "remote-header";
      header.innerHTML = `<span>${remote.friendly_name} <code class="preview">(${remote.entity_id})</code></span>`;
      const learnBtn = document.createElement("button");
      learnBtn.textContent = "+ Learn command";
      learnBtn.onclick = () => this._learnCommand(remote.entity_id);
      header.appendChild(learnBtn);
      remoteEl.appendChild(header);

      const deviceNames = Object.keys(remote.devices).filter((d) => {
        if (!filter) return true;
        if (d.toLowerCase().includes(filter)) return true;
        return Object.keys(remote.devices[d]).some((c) => c.toLowerCase().includes(filter));
      });

      if (!deviceNames.length) {
        const empty = document.createElement("div");
        empty.className = "empty";
        empty.style.padding = "10px 14px";
        empty.textContent = "No devices match the filter.";
        remoteEl.appendChild(empty);
      }

      for (const device of deviceNames) {
        const commands = remote.devices[device];
        const deviceEl = document.createElement("div");
        deviceEl.className = "device";

        const dHeader = document.createElement("div");
        dHeader.className = "device-header";
        const commandCount = Object.keys(commands).length;
        dHeader.innerHTML = `<span>&#128193; ${device} <span class="toggle-badge" style="background:var(--secondary-text-color)">${commandCount}</span></span>`;
        const actions = document.createElement("span");
        actions.className = "device-actions";
        const delDevBtn = document.createElement("button");
        delDevBtn.className = "danger";
        delDevBtn.textContent = "Delete device";
        delDevBtn.onclick = (e) => {
          e.stopPropagation();
          this._deleteDevice(remote.entity_id, device, commands);
        };
        actions.appendChild(delDevBtn);
        dHeader.appendChild(actions);

        const table = document.createElement("table");
        table.style.display = "none";
        dHeader.onclick = () => {
          table.style.display = table.style.display === "none" ? "table" : "none";
        };

        for (const cmdName of Object.keys(commands)) {
          const cmdInfo = commands[cmdName];
          if (
            filter &&
            !device.toLowerCase().includes(filter) &&
            !cmdName.toLowerCase().includes(filter)
          ) {
            continue;
          }
          const code = cmdInfo.codes[0] || "";
          const preview = code.length > 24 ? code.slice(0, 24) + "..." : code;
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${cmdName}${cmdInfo.toggle ? '<span class="toggle-badge">toggle</span>' : ""}</td>
            <td><code class="preview">${preview}</code></td>
            <td class="row-actions"></td>
          `;
          const cell = row.querySelector(".row-actions");

          const testBtn = document.createElement("button");
          testBtn.textContent = "Test";
          testBtn.onclick = () => this._testCommand(remote.entity_id, device, cmdName);
          cell.appendChild(testBtn);

          const copyBtn = document.createElement("button");
          copyBtn.className = "ghost";
          copyBtn.textContent = "Copy";
          copyBtn.onclick = () => this._copyCode(code);
          cell.appendChild(copyBtn);

          const convBtn = document.createElement("button");
          convBtn.className = "ghost";
          convBtn.textContent = "Convert";
          convBtn.onclick = () => this._showConverter(code);
          cell.appendChild(convBtn);

          const renameBtn = document.createElement("button");
          renameBtn.className = "ghost";
          renameBtn.textContent = "Rename";
          renameBtn.onclick = () => this._renameCommand(remote.entity_id, device, cmdName);
          cell.appendChild(renameBtn);

          const delBtn = document.createElement("button");
          delBtn.className = "danger";
          delBtn.textContent = "Delete";
          delBtn.onclick = () => this._deleteCommand(remote.entity_id, device, cmdName);
          cell.appendChild(delBtn);

          table.appendChild(row);
        }

        deviceEl.appendChild(dHeader);
        deviceEl.appendChild(table);
        remoteEl.appendChild(deviceEl);
      }

      content.appendChild(remoteEl);
    }
  }
}

customElements.define("broadlink-codes-panel", BroadlinkCodesPanel);
