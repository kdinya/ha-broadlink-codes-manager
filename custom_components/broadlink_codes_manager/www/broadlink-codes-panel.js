// Broadlink Codes Manager - sidebar panel.
// Plain Web Component, no build step / no external deps, so it can be
// served as a single static file by panel_custom.

const DOMAIN = "broadlink_codes_manager";
const LANG_KEY = "broadlink_codes_manager_lang";

const STRINGS = {
  en: {
    title: "Broadlink Codes Manager",
    subtitle: "Browse, test, copy, rename and delete learned IR codes.",
    filterPlaceholder: "Filter by device or command...",
    loading: "Loading...",
    errorLoading: "Error loading codes",
    noRemotes: "No Broadlink remote entities found. Make sure a Broadlink device is set up in Home Assistant.",
    noMatch: "No devices match the filter.",
    learn: "+ Learn command",
    deleteDevice: "Delete device",
    test: "Test",
    copy: "Copy",
    rename: "Rename",
    delete: "Delete",
    copyToDevice: "Copy to device...",
    toggle: "toggle",
    sentToast: (cmd) => `Sent "${cmd}"`,
    sendFailed: (msg) => `Send failed: ${msg}`,
    deletedToast: (cmd) => `Deleted "${cmd}"`,
    deleteFailed: (msg) => `Delete failed: ${msg}`,
    deletedDeviceToast: (dev) => `Deleted device "${dev}"`,
    renamedToast: (name) => `Renamed to "${name}"`,
    renameFailed: (msg) => `Rename failed: ${msg}`,
    copied: "Copied to clipboard",
    copyFailed: "Copy failed - your browser blocked clipboard access",
    learning: (cmd) => `Learning "${cmd}" - press the remote button now...`,
    learnedToast: (cmd, dev) => `Learned "${cmd}" on "${dev}"`,
    learnFailed: (msg) => `Learn failed: ${msg}`,
    confirmDeleteCmdTitle: "Delete command?",
    confirmDeleteCmdBody: (cmd, dev) => `Delete command "${cmd}" on "${dev}"? This cannot be undone.`,
    confirmDeleteDeviceTitle: "Delete device?",
    confirmDeleteDeviceBody: (count, dev) =>
      `Delete ALL ${count} command(s) on device "${dev}"? This removes the whole device and cannot be undone.`,
    confirmBtn: "Delete",
    cancelBtn: "Cancel",
    renameTitle: "Rename command",
    renameLabel: "New name",
    saveBtn: "Save",
    learnTitle: "Learn new device",
    learnCommandTitle: "Learn command",
    learnNewDeviceLabel: "New device name",
    learnDeviceFixedLabel: "Device",
    learnCommandLabel: "Command name",
    learnBtn: "Learn",
    assumedCarrier: (hz) => `Assumed carrier: ${hz} Hz`,
    pulses: (n) => `${n} pulses`,
    closeBtn: "Close",
    language: "Language",
    required: "This field is required.",
    menuToggle: "Show/hide sidebar",
    commandDetailTitle: "Command",
    codeLabel: "Code",
    copyToDeviceTitle: "Copy command to device",
    copyToDeviceRemoteLabel: "Target remote",
    copyToDeviceDeviceLabel: "Target device",
    copyToDeviceNewOption: "+ New device...",
    copyToDeviceNewDeviceLabel: "New device name",
    copyToDeviceCommandLabel: "Command name",
    copyToDeviceOverwriteLabel: "Overwrite if it already exists",
    copyBtn: "Copy",
    copiedDeviceToast: (cmd, dev) => `Copied "${cmd}" to "${dev}"`,
    copyToDeviceFailed: (msg) => `Copy failed: ${msg}`,
  },
  uk: {
    title: "Менеджер кодів Broadlink",
    subtitle: "Перегляд, тестування, копіювання, перейменування та видалення вивчених ІЧ-кодів.",
    filterPlaceholder: "Фільтр за пристроєм або командою...",
    loading: "Завантаження...",
    errorLoading: "Помилка завантаження кодів",
    noRemotes: "Пульти Broadlink не знайдено. Переконайтеся, що пристрій Broadlink налаштовано в Home Assistant.",
    noMatch: "Немає пристроїв, що відповідають фільтру.",
    learn: "+ Навчити команду",
    deleteDevice: "Видалити пристрій",
    test: "Тест",
    copy: "Копіювати",
    rename: "Перейменувати",
    delete: "Видалити",
    copyToDevice: "Копіювати на пристрій...",
    toggle: "перемикач",
    sentToast: (cmd) => `Надіслано "${cmd}"`,
    sendFailed: (msg) => `Помилка надсилання: ${msg}`,
    deletedToast: (cmd) => `Видалено "${cmd}"`,
    deleteFailed: (msg) => `Помилка видалення: ${msg}`,
    deletedDeviceToast: (dev) => `Пристрій "${dev}" видалено`,
    renamedToast: (name) => `Перейменовано на "${name}"`,
    renameFailed: (msg) => `Помилка перейменування: ${msg}`,
    copied: "Скопійовано в буфер обміну",
    copyFailed: "Не вдалося скопіювати - браузер заблокував доступ до буфера обміну",
    learning: (cmd) => `Навчання "${cmd}" - натисніть кнопку на пульті...`,
    learnedToast: (cmd, dev) => `Команду "${cmd}" вивчено на "${dev}"`,
    learnFailed: (msg) => `Помилка навчання: ${msg}`,
    confirmDeleteCmdTitle: "Видалити команду?",
    confirmDeleteCmdBody: (cmd, dev) => `Видалити команду "${cmd}" на "${dev}"? Це неможливо скасувати.`,
    confirmDeleteDeviceTitle: "Видалити пристрій?",
    confirmDeleteDeviceBody: (count, dev) =>
      `Видалити ВСІ (${count}) команди на пристрої "${dev}"? Це видалить весь пристрій і неможливо скасувати.`,
    confirmBtn: "Видалити",
    cancelBtn: "Скасувати",
    renameTitle: "Перейменувати команду",
    renameLabel: "Нова назва",
    saveBtn: "Зберегти",
    learnTitle: "Навчити новий пристрій",
    learnCommandTitle: "Навчити команду",
    learnNewDeviceLabel: "Назва нового пристрою",
    learnDeviceFixedLabel: "Пристрій",
    learnCommandLabel: "Назва команди",
    learnBtn: "Навчити",
    assumedCarrier: (hz) => `Припущена несуча частота: ${hz} Гц`,
    pulses: (n) => `${n} імпульсів`,
    closeBtn: "Закрити",
    language: "Мова",
    required: "Це поле обов'язкове.",
    menuToggle: "Показати/сховати бокову панель",
    commandDetailTitle: "Команда",
    codeLabel: "Код",
    copyToDeviceTitle: "Копіювати команду на пристрій",
    copyToDeviceRemoteLabel: "Пульт призначення",
    copyToDeviceDeviceLabel: "Пристрій призначення",
    copyToDeviceNewOption: "+ Новий пристрій...",
    copyToDeviceNewDeviceLabel: "Назва нового пристрою",
    copyToDeviceCommandLabel: "Назва команди",
    copyToDeviceOverwriteLabel: "Перезаписати, якщо вже існує",
    copyBtn: "Копіювати",
    copiedDeviceToast: (cmd, dev) => `Команду "${cmd}" скопійовано на "${dev}"`,
    copyToDeviceFailed: (msg) => `Помилка копіювання: ${msg}`,
  },
};

class BroadlinkCodesPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._data = null;
    this._filter = "";
    this._lang = localStorage.getItem(LANG_KEY) || "en";
    if (!STRINGS[this._lang]) this._lang = "en";
  }

  get t() {
    return STRINGS[this._lang];
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

  // panel_custom sets these properties on every custom panel element; we
  // don't need them for layout logic, but must accept them (harmless
  // no-ops) so HA's frontend doesn't hit an error setting an
  // unrecognized property. `narrow` in particular is what tells a panel
  // the sidebar is currently collapsed, which is why panels need their
  // own menu button - see _toggleMenu().
  set narrow(value) {
    this._narrow = value;
  }

  get narrow() {
    return this._narrow;
  }

  set route(value) {
    this._route = value;
  }

  set panel(value) {
    this._panel = value;
  }

  _toggleMenu() {
    // Standard Home Assistant frontend event: any panel can dispatch
    // this to open/close the sidebar drawer. Without it, a custom panel
    // like this one has no way back to the sidebar on narrow (mobile)
    // layouts, or when the user's sidebar is set to auto-hide.
    this.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true }));
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

  // ---- Dialog helpers (in-panel popups, not the browser's native dialogs) ----

  _closeDialog() {
    const overlay = this.shadowRoot.getElementById("dialog-overlay");
    if (overlay) overlay.remove();
  }

  _openDialog(innerHtml, onMount) {
    this._closeDialog();
    const overlay = document.createElement("div");
    overlay.id = "dialog-overlay";
    overlay.className = "dialog-overlay";
    overlay.innerHTML = `<div class="dialog" role="dialog">${innerHtml}</div>`;
    overlay.addEventListener("mousedown", (e) => {
      if (e.target === overlay) this._closeDialog();
    });
    this.shadowRoot.appendChild(overlay);
    const esc = (e) => {
      if (e.key === "Escape") {
        this._closeDialog();
        window.removeEventListener("keydown", esc);
      }
    };
    window.addEventListener("keydown", esc);
    const dialog = overlay.querySelector(".dialog");
    if (onMount) onMount(dialog);
    return dialog;
  }

  _confirmDialog(title, body, confirmLabel) {
    return new Promise((resolve) => {
      const dialog = this._openDialog(`
        <h2>${title}</h2>
        <p>${body}</p>
        <div class="dialog-actions">
          <button class="ghost" id="dlg-cancel">${this.t.cancelBtn}</button>
          <button class="danger" id="dlg-confirm">${confirmLabel || this.t.confirmBtn}</button>
        </div>
      `);
      dialog.querySelector("#dlg-cancel").onclick = () => {
        this._closeDialog();
        resolve(false);
      };
      dialog.querySelector("#dlg-confirm").onclick = () => {
        this._closeDialog();
        resolve(true);
      };
    });
  }

  _promptDialog(title, label, defaultValue) {
    return new Promise((resolve) => {
      const dialog = this._openDialog(`
        <h2>${title}</h2>
        <label class="field-label">${label}
          <input type="text" id="dlg-input" value="${defaultValue ? String(defaultValue).replace(/"/g, "&quot;") : ""}" />
        </label>
        <div class="dialog-error" id="dlg-error"></div>
        <div class="dialog-actions">
          <button class="ghost" id="dlg-cancel">${this.t.cancelBtn}</button>
          <button id="dlg-confirm">${this.t.saveBtn}</button>
        </div>
      `);
      const input = dialog.querySelector("#dlg-input");
      const submit = () => {
        const value = input.value.trim();
        if (!value) {
          dialog.querySelector("#dlg-error").textContent = this.t.required;
          return;
        }
        this._closeDialog();
        resolve(value);
      };
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") submit();
      });
      setTimeout(() => input.focus(), 0);
      dialog.querySelector("#dlg-cancel").onclick = () => {
        this._closeDialog();
        resolve(null);
      };
      dialog.querySelector("#dlg-confirm").onclick = submit;
    });
  }

  _learnDialog(prefillDevice) {
    return new Promise((resolve) => {
      const t = this.t;
      const deviceFieldHtml = prefillDevice
        ? `<div class="field-label">${t.learnDeviceFixedLabel}<div class="fixed-value">${this._escapeHtml(prefillDevice)}</div></div>`
        : `<label class="field-label">${t.learnNewDeviceLabel}
             <input type="text" id="dlg-device" />
           </label>`;
      const dialog = this._openDialog(`
        <h2>${prefillDevice ? t.learnCommandTitle : t.learnTitle}</h2>
        ${deviceFieldHtml}
        <label class="field-label">${t.learnCommandLabel}
          <input type="text" id="dlg-command" />
        </label>
        <div class="dialog-error" id="dlg-error"></div>
        <div class="dialog-actions">
          <button class="ghost" id="dlg-cancel">${t.cancelBtn}</button>
          <button id="dlg-confirm">${t.learnBtn}</button>
        </div>
      `);
      const deviceInput = dialog.querySelector("#dlg-device");
      const commandInput = dialog.querySelector("#dlg-command");
      const submit = () => {
        const device = prefillDevice || deviceInput.value.trim();
        const command = commandInput.value.trim();
        if (!device || !command) {
          dialog.querySelector("#dlg-error").textContent = t.required;
          return;
        }
        this._closeDialog();
        resolve({ device, command });
      };
      commandInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") submit();
      });
      setTimeout(() => (prefillDevice ? commandInput : deviceInput).focus(), 0);
      dialog.querySelector("#dlg-cancel").onclick = () => {
        this._closeDialog();
        resolve(null);
      };
      dialog.querySelector("#dlg-confirm").onclick = submit;
    });
  }

  _infoDialog(title, bodyHtml) {
    const dialog = this._openDialog(`
      <h2>${title}</h2>
      ${bodyHtml}
      <div class="dialog-actions">
        <button id="dlg-close">${this.t.closeBtn}</button>
      </div>
    `);
    dialog.querySelector("#dlg-close").onclick = () => this._closeDialog();
  }

  // ---- Actions ----

  async _testCommand(entityId, device, command) {
    try {
      await this._hass.callService("remote", "send_command", {
        entity_id: entityId,
        device,
        command,
      });
      this._toast(this.t.sentToast(command));
    } catch (err) {
      this._toast(this.t.sendFailed(err.message || err), true);
    }
  }

  async _deleteCommand(entityId, device, command) {
    const ok = await this._confirmDialog(
      this.t.confirmDeleteCmdTitle,
      this.t.confirmDeleteCmdBody(command, device)
    );
    if (!ok) return;
    try {
      await this._hass.callService("remote", "delete_command", {
        entity_id: entityId,
        device,
        command,
      });
      this._toast(this.t.deletedToast(command));
      await this._refresh();
    } catch (err) {
      this._toast(this.t.deleteFailed(err.message || err), true);
    }
  }

  async _deleteDevice(entityId, device, commands) {
    const names = Object.keys(commands);
    const ok = await this._confirmDialog(
      this.t.confirmDeleteDeviceTitle,
      this.t.confirmDeleteDeviceBody(names.length, device)
    );
    if (!ok) return;
    try {
      await this._hass.callService("remote", "delete_command", {
        entity_id: entityId,
        device,
        command: names,
      });
      this._toast(this.t.deletedDeviceToast(device));
      await this._refresh();
    } catch (err) {
      this._toast(this.t.deleteFailed(err.message || err), true);
    }
  }

  async _renameCommand(entityId, device, oldName) {
    const newName = await this._promptDialog(this.t.renameTitle, this.t.renameLabel, oldName);
    if (!newName || newName === oldName) return;
    try {
      await this._callService("rename_command", {
        entity_id: entityId,
        device,
        old_command: oldName,
        new_command: newName,
      });
      this._toast(this.t.renamedToast(newName));
      await this._refresh();
    } catch (err) {
      this._toast(this.t.renameFailed(err.message || err), true);
    }
  }

  async _copyCode(code) {
    // navigator.clipboard requires a secure context (HTTPS) and can be
    // unavailable entirely - e.g. plain-HTTP local network access, which
    // is common for Home Assistant. Fall back to a hidden textarea +
    // execCommand("copy") so Copy still works in that case.
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
        this._toast(this.t.copied);
        return;
      }
      throw new Error("clipboard API unavailable");
    } catch (err) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        this.shadowRoot.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const ok = document.execCommand("copy");
        textarea.remove();
        if (ok) {
          this._toast(this.t.copied);
        } else {
          this._toast(this.t.copyFailed, true);
        }
      } catch (fallbackErr) {
        this._toast(this.t.copyFailed, true);
      }
    }
  }

  async _learnCommand(entityId, prefillDevice) {
    const result = await this._learnDialog(prefillDevice);
    if (!result) return;
    const { device, command } = result;
    this._toast(this.t.learning(command));
    try {
      const result2 = await this._callService(
        "learn_command",
        { entity_id: entityId, device, command, timeout: 20 },
        true
      );
      const resp = result2 && result2.response;
      if (resp && resp.status === "ok") {
        this._toast(this.t.learnedToast(command, device));
        await this._refresh();
      } else {
        this._toast(this.t.learnFailed((resp && resp.error) || "unknown error"), true);
      }
    } catch (err) {
      this._toast(this.t.learnFailed(err.message || err), true);
    }
  }

  // ---- Command detail + copy-to-device ----

  _showCommandDetail(entityId, device, cmdName, cmdInfo) {
    const t = this.t;
    const codeList = cmdInfo.codes || [];
    const code = codeList[0] || "";
    const codesHtml = codeList
      .map((c, i) => `<code class="full-code">${codeList.length > 1 ? `#${i + 1}: ` : ""}${this._escapeHtml(c)}</code>`)
      .join("");

    const dialog = this._openDialog(`
      <h2>${this._escapeHtml(cmdName)}</h2>
      <div class="field-label">${t.codeLabel}</div>
      ${codesHtml}
      <div class="dialog-actions wrap">
        <button id="dtl-test">${t.test}</button>
        <button class="ghost" id="dtl-copy">${t.copy}</button>
        <button class="ghost" id="dtl-copy-dev">${t.copyToDevice}</button>
        <button class="ghost" id="dtl-rename">${t.rename}</button>
        <button class="danger" id="dtl-delete">${t.delete}</button>
        <button class="ghost" id="dlg-close">${t.closeBtn}</button>
      </div>
    `);
    dialog.querySelector("#dtl-test").onclick = () => this._testCommand(entityId, device, cmdName);
    dialog.querySelector("#dtl-copy").onclick = () => this._copyCode(code);
    dialog.querySelector("#dtl-copy-dev").onclick = () => {
      this._closeDialog();
      this._copyToDeviceDialog(entityId, device, cmdName);
    };
    dialog.querySelector("#dtl-rename").onclick = () => {
      this._closeDialog();
      this._renameCommand(entityId, device, cmdName);
    };
    dialog.querySelector("#dtl-delete").onclick = () => {
      this._closeDialog();
      this._deleteCommand(entityId, device, cmdName);
    };
    dialog.querySelector("#dlg-close").onclick = () => this._closeDialog();
  }

  _copyToDeviceDialog(entityId, device, cmdName) {
    const t = this.t;
    const remotes = this._data || [];
    const remoteOptions = remotes
      .map(
        (r) =>
          `<option value="${this._escapeHtml(r.entity_id)}" ${r.entity_id === entityId ? "selected" : ""}>${this._escapeHtml(r.friendly_name)}</option>`
      )
      .join("");
    const deviceNamesForRemote = (eid) => {
      const remote = remotes.find((r) => r.entity_id === eid);
      return remote ? Object.keys(remote.devices) : [];
    };
    const NEW_DEVICE = "__new__";
    const buildDeviceOptions = (eid, preselect) => {
      const names = deviceNamesForRemote(eid);
      const opts = names
        .map((d) => `<option value="${this._escapeHtml(d)}" ${d === preselect ? "selected" : ""}>${this._escapeHtml(d)}</option>`)
        .join("");
      const newSelected = !names.includes(preselect) ? "selected" : "";
      return opts + `<option value="${NEW_DEVICE}" ${newSelected}>${t.copyToDeviceNewOption}</option>`;
    };

    const dialog = this._openDialog(`
      <h2>${t.copyToDeviceTitle}</h2>
      <label class="field-label">${t.copyToDeviceRemoteLabel}
        <select id="cpd-remote">${remoteOptions}</select>
      </label>
      <label class="field-label">${t.copyToDeviceDeviceLabel}
        <select id="cpd-device-select">${buildDeviceOptions(entityId, device)}</select>
      </label>
      <label class="field-label" id="cpd-device-new-wrap" style="display:none;">${t.copyToDeviceNewDeviceLabel}
        <input type="text" id="cpd-device-new" />
      </label>
      <label class="field-label">${t.copyToDeviceCommandLabel}
        <input type="text" id="cpd-command" value="${this._escapeHtml(cmdName)}" />
      </label>
      <label class="checkbox-row">
        <input type="checkbox" id="cpd-overwrite" />
        ${t.copyToDeviceOverwriteLabel}
      </label>
      <div class="dialog-error" id="dlg-error"></div>
      <div class="dialog-actions">
        <button class="ghost" id="dlg-cancel">${t.cancelBtn}</button>
        <button id="dlg-confirm">${t.copyBtn}</button>
      </div>
    `);

    const remoteSelect = dialog.querySelector("#cpd-remote");
    const deviceSelect = dialog.querySelector("#cpd-device-select");
    const newWrap = dialog.querySelector("#cpd-device-new-wrap");
    const newInput = dialog.querySelector("#cpd-device-new");

    const syncNewDeviceVisibility = () => {
      const isNew = deviceSelect.value === NEW_DEVICE;
      newWrap.style.display = isNew ? "block" : "none";
      if (isNew) newInput.focus();
    };
    syncNewDeviceVisibility();

    remoteSelect.addEventListener("change", () => {
      // Switching remote invalidates the previous device choice - default
      // back to the first existing device on the new remote (or "new").
      deviceSelect.innerHTML = buildDeviceOptions(remoteSelect.value, null);
      syncNewDeviceVisibility();
    });
    deviceSelect.addEventListener("change", syncNewDeviceVisibility);

    dialog.querySelector("#dlg-cancel").onclick = () => this._closeDialog();
    dialog.querySelector("#dlg-confirm").onclick = async () => {
      const targetEntityId = remoteSelect.value;
      const targetDevice =
        deviceSelect.value === NEW_DEVICE ? newInput.value.trim() : deviceSelect.value;
      const targetCommand = dialog.querySelector("#cpd-command").value.trim();
      const overwrite = dialog.querySelector("#cpd-overwrite").checked;
      if (!targetDevice || !targetCommand) {
        dialog.querySelector("#dlg-error").textContent = t.required;
        return;
      }
      this._closeDialog();
      try {
        await this._callService("copy_command", {
          entity_id: entityId,
          device,
          command: cmdName,
          target_entity_id: targetEntityId,
          target_device: targetDevice,
          target_command: targetCommand,
          overwrite,
        });
        this._toast(t.copiedDeviceToast(targetCommand, targetDevice));
        await this._refresh();
      } catch (err) {
        this._toast(t.copyToDeviceFailed(err.message || err), true);
      }
    };
  }

  _escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = String(str);
    return div.innerHTML;
  }

  _setLang(lang) {
    if (!STRINGS[lang]) return;
    this._lang = lang;
    localStorage.setItem(LANG_KEY, lang);
    this._render();
  }

  _render() {
    const root = this.shadowRoot;
    const t = this.t;
    root.innerHTML = `
      <style>
        :host { display: block; padding: 16px; font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
          color: var(--primary-text-color); }
        .app-toolbar { display: flex; align-items: center; gap: 4px; margin: -16px -16px 8px; padding: 8px 8px;
          background: var(--app-header-background-color, var(--primary-background-color));
          border-bottom: 1px solid var(--divider-color); position: sticky; top: 0; z-index: 5; }
        .menu-btn { background: transparent; color: var(--primary-text-color); padding: 8px; margin: 0;
          border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px;
          box-sizing: border-box; }
        .menu-btn:hover { background: var(--secondary-background-color); }
        .menu-btn svg { width: 24px; height: 24px; fill: currentColor; }
        .app-toolbar .app-title { font-weight: 500; font-size: 16px; margin-left: 4px; }
        .top-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
        h1 { font-size: 22px; margin: 0 0 4px; font-weight: 500; }
        .sub { color: var(--secondary-text-color); margin-bottom: 16px; font-size: 13px; }
        select.lang { padding: 6px 8px; border-radius: 4px; border: 1px solid var(--divider-color);
          background: var(--card-background-color); color: var(--primary-text-color); font-size: 13px; }
        input.filter { width: 100%; max-width: 360px; padding: 9px 10px; margin-bottom: 18px;
          border-radius: 8px; border: 1px solid var(--divider-color); box-sizing: border-box;
          background: var(--card-background-color); color: var(--primary-text-color); font-size: 14px; }
        .remote { margin-bottom: 20px; border-radius: 12px; overflow: hidden;
          box-shadow: var(--ha-card-box-shadow, 0 1px 3px rgba(0,0,0,0.12)); background: var(--card-background-color); }
        .remote-header { background: var(--card-background-color); padding: 14px 16px; font-weight: 600;
          font-size: 15px; display: flex; justify-content: space-between; align-items: center; gap: 10px;
          border-bottom: 1px solid var(--divider-color); }
        .remote-header .header-title { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .remote-header .entity-id { display: block; font-weight: 400; color: var(--secondary-text-color);
          font-size: 11px; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .remote-header button, .device-header button { flex-shrink: 0; white-space: nowrap; }
        .device { border-bottom: 1px solid var(--divider-color); }
        .device:last-child { border-bottom: none; }
        .device-header { display: flex; justify-content: space-between; align-items: center; gap: 10px;
          padding: 10px 16px; cursor: pointer; user-select: none; }
        .device-header .header-title { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .device-header:hover { background: var(--secondary-background-color); }
        .device-header .chevron { display: inline-block; transition: transform .15s; margin-right: 6px; opacity: .6; }
        .device-header.open .chevron { transform: rotate(90deg); }
        .count-badge { font-size: 11px; background: var(--secondary-background-color); color: var(--secondary-text-color);
          border-radius: 10px; padding: 2px 8px; margin-left: 8px; }
        .commands-grid { display: none; flex-wrap: wrap; gap: 8px; padding: 4px 16px 16px; }
        .cmd-chip { position: relative; background: var(--secondary-background-color);
          color: var(--primary-text-color); border: 1px solid var(--divider-color);
          border-radius: 20px; padding: 8px 16px; font-size: 13px; font-weight: 500;
          margin-left: 0; }
        .cmd-chip:hover { background: var(--primary-color); color: var(--text-primary-color, #fff);
          border-color: var(--primary-color); }
        .cmd-chip.add-chip { background: transparent; border-style: dashed; color: var(--primary-color);
          font-size: 16px; font-weight: 600; padding: 8px 14px; min-width: 40px; text-align: center; }
        .cmd-chip.add-chip:hover { background: var(--primary-color); color: var(--text-primary-color, #fff);
          border-style: solid; }
        .cmd-chip .toggle-badge { margin-left: 6px; }
        button { cursor: pointer; border: none; background: var(--primary-color); color: var(--text-primary-color, #fff);
          padding: 5px 10px; border-radius: 6px; font-size: 12px; margin-left: 6px; font-weight: 500; }
        button:hover { filter: brightness(1.05); }
        button.ghost { background: transparent; color: var(--primary-color); border: 1px solid var(--divider-color); }
        button.danger { background: var(--error-color, #db4437); }
        .toggle-badge { font-size: 10px; background: var(--accent-color); color: #fff; border-radius: 4px; padding: 1px 5px; margin-left: 6px; }
        .empty { color: var(--secondary-text-color); padding: 24px 4px; font-size: 14px; }
        .toast { position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%);
          background: var(--primary-text-color); color: var(--primary-background-color);
          padding: 10px 16px; border-radius: 8px; opacity: 0; pointer-events: none; transition: opacity .2s; font-size: 13px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2); z-index: 20; }
        .toast.show { opacity: 0.95; }
        .toast.error { background: var(--error-color, #db4437); color: #fff; }

        .dialog-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex;
          align-items: center; justify-content: center; z-index: 30; }
        .dialog { background: var(--card-background-color); color: var(--primary-text-color); border-radius: 12px;
          padding: 20px; width: 90%; max-width: 420px; max-height: 80vh; overflow-y: auto;
          box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
        .dialog h2 { margin: 0 0 12px; font-size: 17px; }
        .dialog p { margin: 0 0 8px; font-size: 14px; line-height: 1.5; }
        .dialog-actions { display: flex; justify-content: flex-end; margin-top: 16px; gap: 8px; }
        .dialog-actions button { margin-left: 0; padding: 8px 14px; font-size: 13px; }
        .field-label { display: block; font-size: 12px; color: var(--secondary-text-color); margin-top: 10px; }
        .field-label input, .field-label select { display: block; width: 100%; box-sizing: border-box; margin-top: 4px; padding: 8px;
          border-radius: 6px; border: 1px solid var(--divider-color); background: var(--card-background-color);
          color: var(--primary-text-color); font-size: 14px; font-family: inherit; }
        .fixed-value { margin-top: 4px; padding: 8px; border-radius: 6px; background: var(--secondary-background-color);
          color: var(--primary-text-color); font-size: 14px; }
        .checkbox-row { display: flex; align-items: center; gap: 8px; margin-top: 14px; font-size: 13px; }
        .checkbox-row input { margin: 0; }
        .full-code { display: block; font-family: var(--code-font-family, monospace); font-size: 12px;
          word-break: break-all; background: var(--secondary-background-color); padding: 10px; border-radius: 6px;
          margin: 8px 0 14px; max-height: 140px; overflow-y: auto; }
        .dialog-actions.wrap { flex-wrap: wrap; }
        .dialog-error { color: var(--error-color, #db4437); font-size: 12px; min-height: 16px; margin-top: 6px; }
      </style>
      <div class="app-toolbar">
        <button class="menu-btn" id="menu-btn" title="${t.menuToggle}" aria-label="${t.menuToggle}">
          <svg viewBox="0 0 24 24"><path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" /></svg>
        </button>
      </div>
      <div class="top-row">
        <div>
          <h1>${t.title}</h1>
          <div class="sub">${t.subtitle}</div>
        </div>
        <select class="lang" id="lang-select" title="${t.language}">
          <option value="en" ${this._lang === "en" ? "selected" : ""}>English</option>
          <option value="uk" ${this._lang === "uk" ? "selected" : ""}>Українська</option>
        </select>
      </div>
      <input class="filter" type="search" placeholder="${t.filterPlaceholder}" />
      <div id="content"></div>
      <div id="toast" class="toast"></div>
    `;

    root.getElementById("menu-btn").addEventListener("click", () => this._toggleMenu());

    root.getElementById("lang-select").addEventListener("change", (e) => {
      this._setLang(e.target.value);
    });

    const filterInput = root.querySelector("input.filter");
    filterInput.value = this._filter;
    filterInput.addEventListener("input", (e) => {
      this._filter = e.target.value.toLowerCase();
      this._renderContent();
    });

    this._renderContent();
  }

  _renderContent() {
    const t = this.t;
    const content = this.shadowRoot.getElementById("content");
    if (!content) return;

    if (this._data === null) {
      content.innerHTML = `<div class="empty">${t.loading}</div>`;
      return;
    }
    if (this._error) {
      content.innerHTML = `<div class="empty">${t.errorLoading}: ${this._escapeHtml(this._error)}</div>`;
      return;
    }
    if (!this._data.length) {
      content.innerHTML = `<div class="empty">${t.noRemotes}</div>`;
      return;
    }

    const filter = this._filter;
    content.innerHTML = "";

    for (const remote of this._data) {
      const remoteEl = document.createElement("div");
      remoteEl.className = "remote";

      const header = document.createElement("div");
      header.className = "remote-header";
      header.innerHTML = `<span class="header-title">${this._escapeHtml(remote.friendly_name || remote.entity_id)}<span class="entity-id">${this._escapeHtml(remote.entity_id)}</span></span>`;
      const learnBtn = document.createElement("button");
      learnBtn.textContent = t.learn;
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
        empty.style.padding = "10px 16px";
        empty.textContent = t.noMatch;
        remoteEl.appendChild(empty);
      }

      for (const device of deviceNames) {
        const commands = remote.devices[device];
        const deviceEl = document.createElement("div");
        deviceEl.className = "device";

        const dHeader = document.createElement("div");
        dHeader.className = "device-header";
        const commandCount = Object.keys(commands).length;
        dHeader.innerHTML = `<span class="header-title"><span class="chevron">&#9656;</span>&#128193; ${this._escapeHtml(device)}<span class="count-badge">${commandCount}</span></span>`;
        const actions = document.createElement("span");
        actions.className = "device-actions";
        const delDevBtn = document.createElement("button");
        delDevBtn.className = "danger";
        delDevBtn.textContent = t.deleteDevice;
        delDevBtn.onclick = (e) => {
          e.stopPropagation();
          this._deleteDevice(remote.entity_id, device, commands);
        };
        actions.appendChild(delDevBtn);
        dHeader.appendChild(actions);

        const grid = document.createElement("div");
        grid.className = "commands-grid";
        grid.style.display = "none";
        dHeader.onclick = () => {
          const open = grid.style.display !== "none";
          grid.style.display = open ? "none" : "flex";
          dHeader.classList.toggle("open", !open);
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
          const codeList = cmdInfo.codes || [];
          const toggleBadge = cmdInfo.toggle
            ? `<span class="toggle-badge" title="${this._escapeHtml(t.toggle)} &times;${codeList.length}">&times;${codeList.length}</span>`
            : "";
          const chip = document.createElement("button");
          chip.type = "button";
          chip.className = "cmd-chip";
          chip.innerHTML = `${this._escapeHtml(cmdName)}${toggleBadge}`;
          chip.onclick = () => this._showCommandDetail(remote.entity_id, device, cmdName, cmdInfo);
          grid.appendChild(chip);
        }

        const addChip = document.createElement("button");
        addChip.type = "button";
        addChip.className = "cmd-chip add-chip";
        addChip.textContent = "+";
        addChip.title = t.learn;
        addChip.onclick = (e) => {
          e.stopPropagation();
          this._learnCommand(remote.entity_id, device);
        };
        grid.appendChild(addChip);

        deviceEl.appendChild(dHeader);
        deviceEl.appendChild(grid);
        remoteEl.appendChild(deviceEl);
      }

      content.appendChild(remoteEl);
    }
  }
}

customElements.define("broadlink-codes-panel", BroadlinkCodesPanel);
