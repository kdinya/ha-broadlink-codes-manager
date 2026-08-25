// Broadlink Codes Manager - sidebar panel.
// Plain Web Component, no build step / no external deps, so it can be
// served as a single static file by panel_custom.

const DOMAIN = "broadlink_codes_manager";
const LANG_KEY = "broadlink_codes_manager_lang";
const REPO_URL = "https://github.com/kdinya/ha-broadlink-codes-manager";

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
    createDevice: "+ Create device",
    deleteDevice: "Delete device",
    editDevice: "Edit",
    back: "Back",
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
    waitingForSignal: "Point your remote at the receiver and press the button now...",
    learnedToast: (cmd, dev) => `Learned "${cmd}" on "${dev}"`,
    learnFailed: (msg) => `Learn failed: ${msg}`,
    createDeviceTitle: "Create device",
    createDeviceNameLabel: "Device name",
    createDeviceTypeLabel: "Device type",
    createDeviceBtn: "Create",
    createdDeviceToast: (name) => `Created device "${name}"`,
    createDeviceFailed: (msg) => `Could not create device: ${msg}`,
    deviceAlreadyExists: (name) => `Device "${name}" already exists.`,
    learnForExistingBtn: "Learn command for this device instead",
    editDeviceTitle: "Edit device",
    editDeviceNameLabel: "Device name",
    editDeviceTypeLabel: "Device type",
    deviceUpdatedToast: (name) => `Device updated ("${name}")`,
    editDeviceFailed: (msg) => `Could not update device: ${msg}`,
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
    learnCommandTitle: "Learn command",
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
    repoLink: "View on GitHub",
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
    createDevice: "+ Створити пристрій",
    deleteDevice: "Видалити пристрій",
    editDevice: "Редагувати",
    back: "Назад",
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
    waitingForSignal: "Направте пульт на приймач і натисніть кнопку зараз...",
    learnedToast: (cmd, dev) => `Команду "${cmd}" вивчено на "${dev}"`,
    learnFailed: (msg) => `Помилка навчання: ${msg}`,
    createDeviceTitle: "Створити пристрій",
    createDeviceNameLabel: "Назва пристрою",
    createDeviceTypeLabel: "Тип пристрою",
    createDeviceBtn: "Створити",
    createdDeviceToast: (name) => `Створено пристрій "${name}"`,
    createDeviceFailed: (msg) => `Не вдалося створити пристрій: ${msg}`,
    deviceAlreadyExists: (name) => `Пристрій "${name}" вже існує.`,
    learnForExistingBtn: "Навчити команду для цього пристрою",
    editDeviceTitle: "Редагувати пристрій",
    editDeviceNameLabel: "Назва пристрою",
    editDeviceTypeLabel: "Тип пристрою",
    deviceUpdatedToast: (name) => `Пристрій оновлено ("${name}")`,
    editDeviceFailed: (msg) => `Не вдалося оновити пристрій: ${msg}`,
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
    learnCommandTitle: "Навчити команду",
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
    repoLink: "Переглянути на GitHub",
  },
};

// Kept in sync with DEVICE_TYPE_KEYS in const.py - the set of device types
// a user can explicitly assign, each with an icon and a keyword list used
// to guess a type from a device's name when no explicit choice was made.
const DEVICE_TYPES = [
  { key: "", icon: "🔍", en: "Auto-detect from name", uk: "Автовизначення за назвою", keywords: [] },
  { key: "tv", icon: "📺", en: "TV", uk: "Телевізор", keywords: ["tv", "телев", "телек"] },
  { key: "set_top_box", icon: "📡", en: "Set-top box / Receiver box", uk: "Приставка / Тюнер", keywords: ["box", "приставк", "тюнер", "set-top", "settop"] },
  { key: "projector", icon: "📽️", en: "Projector", uk: "Проектор", keywords: ["projector", "проектор"] },
  { key: "air_conditioner", icon: "❄️", en: "Air Conditioner", uk: "Кондиціонер", keywords: ["air condition", " ac", "клімат", "кондиц"] },
  { key: "fan", icon: "🌀", en: "Fan", uk: "Вентилятор", keywords: ["fan", "вентил"] },
  { key: "ceiling_fan", icon: "🌬️", en: "Ceiling Fan", uk: "Стельовий вентилятор", keywords: ["ceiling fan", "стельов"] },
  { key: "heater", icon: "🔥", en: "Heater", uk: "Обігрівач", keywords: ["heat", "обігрів", "тепл"] },
  { key: "fireplace", icon: "🪵", en: "Fireplace", uk: "Камін", keywords: ["fireplace", "камін"] },
  { key: "humidifier", icon: "💧", en: "Humidifier", uk: "Зволожувач", keywords: ["humidif", "зволож"] },
  { key: "dehumidifier", icon: "🌫️", en: "Dehumidifier", uk: "Осушувач", keywords: ["dehumid", "осуш"] },
  { key: "air_purifier", icon: "🍃", en: "Air Purifier", uk: "Очищувач повітря", keywords: ["purifier", "очищ"] },
  { key: "light", icon: "💡", en: "Light", uk: "Світло", keywords: ["light", "lamp", "світло", "лампа", "люстра"] },
  { key: "speaker", icon: "🔊", en: "Speaker", uk: "Колонка", keywords: ["speaker", "audio", "sound", "колон", "звук", "музик"] },
  { key: "soundbar", icon: "🎚️", en: "Soundbar", uk: "Саундбар", keywords: ["soundbar", "саундбар"] },
  { key: "receiver", icon: "📻", en: "AV Receiver", uk: "AV-ресивер", keywords: ["receiver", "ресивер"] },
  { key: "curtain", icon: "🪟", en: "Curtain / Blinds", uk: "Штори / Жалюзі", keywords: ["curtain", "blind", "штор", "жалюз"] },
  { key: "garage_door", icon: "🚪", en: "Garage Door", uk: "Гаражні ворота", keywords: ["garage", "гараж"] },
  { key: "door_lock", icon: "🔒", en: "Door Lock", uk: "Замок", keywords: ["lock", "замок"] },
  { key: "camera", icon: "📷", en: "Camera", uk: "Камера", keywords: ["camera", "камер"] },
  { key: "doorbell", icon: "🔔", en: "Doorbell", uk: "Дзвінок", keywords: ["doorbell", "дзвінок", "дзвоник"] },
  { key: "robot_vacuum", icon: "🤖", en: "Robot Vacuum", uk: "Робот-пилосос", keywords: ["vacuum", "пилосос"] },
  { key: "washing_machine", icon: "🫧", en: "Washing Machine", uk: "Пральна машина", keywords: ["wash", "пральн"] },
  { key: "dryer", icon: "🌪️", en: "Dryer", uk: "Сушарка", keywords: ["dryer", "сушарк", "сушильн"] },
  { key: "dishwasher", icon: "🍽️", en: "Dishwasher", uk: "Посудомийка", keywords: ["dishwasher", "посудомий"] },
  { key: "oven", icon: "🍞", en: "Oven", uk: "Духовка", keywords: ["oven", "духовк"] },
  { key: "microwave", icon: "♨️", en: "Microwave", uk: "Мікрохвильовка", keywords: ["microwave", "мікрохвильов"] },
  { key: "refrigerator", icon: "🧊", en: "Refrigerator", uk: "Холодильник", keywords: ["fridge", "refriger", "холодильник"] },
  { key: "kettle", icon: "🫖", en: "Kettle", uk: "Чайник", keywords: ["kettle", "чайник"] },
  { key: "coffee_maker", icon: "☕", en: "Coffee Maker", uk: "Кавоварка", keywords: ["coffee", "кавов"] },
  { key: "water_heater", icon: "🚿", en: "Water Heater", uk: "Водонагрівач", keywords: ["water heater", "водонагрів", "бойлер"] },
  { key: "pool_pump", icon: "🏊", en: "Pool Pump", uk: "Насос басейну", keywords: ["pool", "басейн"] },
  { key: "lawn_mower", icon: "🌱", en: "Lawn Mower", uk: "Газонокосарка", keywords: ["mower", "газонокосар"] },
  { key: "generic", icon: "🎛️", en: "Other / Generic remote", uk: "Інше / Загальний пульт", keywords: [] },
];

class BroadlinkCodesPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._data = null;
    this._filter = "";
    this._openDevice = null; // {entityId, device} when drilled into a device's command list
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

  // Learning a command is always for an already-known device now (device
  // *creation* is its own separate flow - see _createDeviceDialog) - so
  // this keeps a single dialog open across three states (form -> waiting
  // for the IR signal -> showing the received code with Test/Save/Cancel)
  // instead of closing and reopening, which used to make it unclear
  // whether anything had actually happened.
  _learnCommand(entityId, device) {
    const t = this.t;

    const renderForm = (dialog, errorMsg) => {
      dialog.innerHTML = `
        <h2>${t.learnCommandTitle}</h2>
        <div class="field-label">${t.learnDeviceFixedLabel}<div class="fixed-value">${this._escapeHtml(device)}</div></div>
        <label class="field-label">${t.learnCommandLabel}
          <input type="text" id="lc-command" />
        </label>
        <div class="dialog-error" id="dlg-error">${errorMsg ? this._escapeHtml(errorMsg) : ""}</div>
        <div class="dialog-actions">
          <button class="ghost" id="dlg-cancel">${t.cancelBtn}</button>
          <button id="dlg-confirm">${t.learnBtn}</button>
        </div>
      `;
      const input = dialog.querySelector("#lc-command");
      const submit = () => {
        const command = input.value.trim();
        if (!command) {
          dialog.querySelector("#dlg-error").textContent = t.required;
          return;
        }
        renderWaiting(dialog, command);
      };
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") submit();
      });
      setTimeout(() => input.focus(), 0);
      dialog.querySelector("#dlg-cancel").onclick = () => this._closeDialog();
      dialog.querySelector("#dlg-confirm").onclick = submit;
    };

    const renderWaiting = (dialog, command) => {
      dialog.innerHTML = `
        <h2>${this._escapeHtml(command)}</h2>
        <p>${t.waitingForSignal}</p>
        <div class="dialog-actions">
          <button class="ghost" id="dlg-cancel">${t.cancelBtn}</button>
        </div>
      `;
      dialog.querySelector("#dlg-cancel").onclick = () => this._closeDialog();

      this._callService("learn_command", { entity_id: entityId, device, command, timeout: 20 }, true)
        .then((res) => {
          // The dialog may have been closed (or moved on to a different
          // state) while this was in flight - nothing to update then.
          if (!dialog.isConnected) return;
          const resp = res && res.response;
          if (resp && resp.status === "ok") {
            renderResult(dialog, command, resp.code, resp.toggle);
          } else {
            renderForm(dialog, t.learnFailed((resp && resp.error) || "unknown error"));
          }
        })
        .catch((err) => {
          if (!dialog.isConnected) return;
          renderForm(dialog, t.learnFailed(err.message || err));
        });
    };

    const renderResult = (dialog, command, code, toggle) => {
      const toggleNote = toggle ? ` <span class="toggle-badge">${this._escapeHtml(t.toggle)}</span>` : "";
      dialog.innerHTML = `
        <h2>${this._escapeHtml(command)}${toggleNote}</h2>
        <div class="field-label">${t.codeLabel}</div>
        <code class="full-code">${this._escapeHtml(code || "")}</code>
        <div class="dialog-actions wrap">
          <button id="lr-test">${t.test}</button>
          <button class="danger" id="lr-cancel">${t.cancelBtn}</button>
          <button id="lr-save">${t.saveBtn}</button>
        </div>
      `;
      dialog.querySelector("#lr-test").onclick = () => this._testCommand(entityId, device, command);
      dialog.querySelector("#lr-save").onclick = async () => {
        this._closeDialog();
        this._toast(t.learnedToast(command, device));
        await this._refresh();
      };
      dialog.querySelector("#lr-cancel").onclick = async () => {
        // remote.learn_command already saved this the moment the signal
        // was received - "Cancel" here means "discard what was just
        // learned", so it deletes the command it just created rather
        // than just closing (which would silently leave it behind).
        try {
          await this._hass.callService("remote", "delete_command", { entity_id: entityId, device, command });
        } catch (err) {
          // Best-effort: even if the delete fails, closing is still the
          // right move here - the command just lingers and can be
          // removed normally from its detail dialog afterwards.
        }
        this._closeDialog();
        await this._refresh();
      };
    };

    const dialog = this._openDialog("");
    renderForm(dialog);
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
      // Goes through our own delete_device service rather than
      // remote.delete_command: that service only removes named
      // commands one at a time and Broadlink's own entity never drops
      // a device that has none left to iterate, so a device created
      // via "Create device" but never given a command could never be
      // removed. delete_device drops the device entry directly, which
      // also covers that empty-device case.
      await this._callService("delete_device", {
        entity_id: entityId,
        device,
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

  // Creating a device is deliberately separate from learning a command
  // (see _learnCommand above) - this only ever produces an empty device
  // container (name + optional type/icon); commands are learned into it
  // afterwards from its own page. If the name is already taken, this
  // stays open and offers a shortcut into the existing device's
  // learn-command flow instead of silently doing something surprising.
  _createDeviceDialog(entityId) {
    const t = this.t;
    const dialog = this._openDialog(`
      <h2>${t.createDeviceTitle}</h2>
      <label class="field-label">${t.createDeviceNameLabel}
        <input type="text" id="cd-name" />
      </label>
      <label class="field-label">${t.createDeviceTypeLabel}
        <select id="cd-type">${this._deviceTypeOptions("")}</select>
      </label>
      <div class="dialog-error" id="dlg-error"></div>
      <div class="dialog-actions" id="cd-actions">
        <button class="ghost" id="dlg-cancel">${t.cancelBtn}</button>
        <button id="dlg-confirm">${t.createDeviceBtn}</button>
      </div>
    `);
    const nameInput = dialog.querySelector("#cd-name");
    const typeSelect = dialog.querySelector("#cd-type");
    setTimeout(() => nameInput.focus(), 0);
    dialog.querySelector("#dlg-cancel").onclick = () => this._closeDialog();

    const submit = async () => {
      const device = nameInput.value.trim();
      if (!device) {
        dialog.querySelector("#dlg-error").textContent = t.required;
        return;
      }
      try {
        await this._callService("create_device", {
          entity_id: entityId,
          device,
          device_type: typeSelect.value,
        });
        this._closeDialog();
        this._toast(t.createdDeviceToast(device));
        await this._refresh();
        this._openDevice = { entityId, device };
        this._renderContent();
      } catch (err) {
        const msg = err.message || String(err);
        const errBox = dialog.querySelector("#dlg-error");
        if (/already exists/i.test(msg)) {
          errBox.textContent = t.deviceAlreadyExists(device);
          let hintBtn = dialog.querySelector("#cd-learn-existing");
          if (!hintBtn) {
            hintBtn = document.createElement("button");
            hintBtn.className = "ghost";
            hintBtn.id = "cd-learn-existing";
            dialog.querySelector("#cd-actions").prepend(hintBtn);
          }
          hintBtn.textContent = t.learnForExistingBtn;
          hintBtn.onclick = () => {
            this._closeDialog();
            this._learnCommand(entityId, device);
          };
        } else {
          errBox.textContent = t.createDeviceFailed(msg);
        }
      }
    };
    dialog.querySelector("#dlg-confirm").onclick = submit;
  }

  // Rename and/or re-type an existing device in one dialog.
  async _editDeviceDialog(entityId, device) {
    const t = this.t;
    const remote = this._data.find((r) => r.entity_id === entityId);
    const currentType = (remote && remote.device_types && remote.device_types[device]) || "";

    const dialog = this._openDialog(`
      <h2>${t.editDeviceTitle}</h2>
      <label class="field-label">${t.editDeviceNameLabel}
        <input type="text" id="ed-name" value="${this._escapeHtml(device)}" />
      </label>
      <label class="field-label">${t.editDeviceTypeLabel}
        <select id="ed-type">${this._deviceTypeOptions(currentType)}</select>
      </label>
      <div class="dialog-error" id="dlg-error"></div>
      <div class="dialog-actions">
        <button class="ghost" id="dlg-cancel">${t.cancelBtn}</button>
        <button id="dlg-confirm">${t.saveBtn}</button>
      </div>
    `);
    dialog.querySelector("#dlg-cancel").onclick = () => this._closeDialog();
    dialog.querySelector("#dlg-confirm").onclick = async () => {
      const newName = dialog.querySelector("#ed-name").value.trim();
      const newType = dialog.querySelector("#ed-type").value;
      if (!newName) {
        dialog.querySelector("#dlg-error").textContent = t.required;
        return;
      }
      this._closeDialog();
      try {
        if (newName !== device) {
          await this._callService("rename_device", {
            entity_id: entityId,
            old_device: device,
            new_device: newName,
          });
        }
        if (newType !== currentType) {
          await this._callService("set_device_type", {
            entity_id: entityId,
            device: newName,
            device_type: newType,
          });
        }
        this._toast(t.deviceUpdatedToast(newName));
        this._openDevice = { entityId, device: newName };
        await this._refresh();
      } catch (err) {
        this._toast(t.editDeviceFailed(err.message || err), true);
        await this._refresh();
      }
    };
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

  // Guesses a device-type key from its name (used when no explicit type
  // was chosen for it) - "" (auto) and "generic" (the catch-all, empty
  // keyword list) are never matched here, only real, keyword-bearing types.
  _guessDeviceType(name) {
    const n = name.toLowerCase();
    for (const dt of DEVICE_TYPES) {
      if (dt.keywords.length && dt.keywords.some((k) => n.includes(k))) return dt.key;
    }
    return "generic";
  }

  // The type actually shown for a device: an explicit choice (stored
  // server-side, set at creation or via Edit device) takes priority,
  // falling back to a guess from the name.
  _effectiveDeviceType(remote, device) {
    const explicit = remote && remote.device_types && remote.device_types[device];
    return explicit || this._guessDeviceType(device);
  }

  _deviceTypeIcon(key) {
    const dt = DEVICE_TYPES.find((d) => d.key === key);
    return dt ? dt.icon : "🎛️";
  }

  _deviceTypeLabel(key) {
    const dt = DEVICE_TYPES.find((d) => d.key === key) || DEVICE_TYPES[DEVICE_TYPES.length - 1];
    return this._lang === "uk" ? dt.uk : dt.en;
  }

  _deviceTypeOptions(selectedKey) {
    return DEVICE_TYPES.map(
      (dt) =>
        `<option value="${dt.key}" ${dt.key === selectedKey ? "selected" : ""}>${dt.icon} ${this._lang === "uk" ? dt.uk : dt.en}</option>`
    ).join("");
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
        .remote { margin-bottom: 20px; border-radius: 14px; overflow: hidden;
          box-shadow: var(--ha-card-box-shadow, 0 1px 3px rgba(0,0,0,0.12)); background: var(--card-background-color); }
        .remote-header { background: var(--card-background-color); padding: 14px 16px; font-weight: 600;
          font-size: 15px; display: flex; justify-content: space-between; align-items: center; gap: 10px;
          border-bottom: 1px solid var(--divider-color); }
        .remote-header .header-title { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .remote-header .entity-id { display: block; font-weight: 400; color: var(--secondary-text-color);
          font-size: 11px; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .remote-header button { flex-shrink: 0; white-space: nowrap; }

        /* ---- device tile grid (list of devices) ---- */
        .device-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
          gap: 12px; padding: 16px; }
        .device-tile { position: relative; background: var(--secondary-background-color);
          border: 1px solid var(--divider-color); border-radius: 16px; padding: 18px 10px 12px;
          text-align: center; cursor: pointer; transition: background .12s, border-color .12s, transform .12s; }
        .device-tile:hover { border-color: var(--primary-color); transform: translateY(-2px); }
        .device-tile .tile-icon { font-size: 28px; line-height: 1; display: block; margin-bottom: 10px; }
        .device-tile .tile-name { display: block; width: 100%; font-size: 13px; font-weight: 600;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .device-tile .tile-count { display: block; font-size: 11px; color: var(--secondary-text-color); margin-top: 3px; }

        /* ---- plain command list (inside a device) ---- */
        .device-view-header { display: flex; align-items: center; gap: 4px; padding: 14px 16px;
          border-bottom: 1px solid var(--divider-color); background: var(--card-background-color); }
        .device-view-header .back-btn, .device-view-header .icon-btn { background: transparent; color: var(--primary-text-color);
          padding: 6px; margin: 0; border-radius: 50%; width: 32px; height: 32px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; }
        .device-view-header .back-btn:hover, .device-view-header .icon-btn:hover { background: var(--secondary-background-color); }
        .device-view-header .back-btn svg, .device-view-header .icon-btn svg { width: 20px; height: 20px; fill: currentColor; }
        .device-view-header .title { flex: 1; min-width: 0; font-size: 16px; font-weight: 600;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .device-view-header .danger { flex-shrink: 0; white-space: nowrap; margin-left: 4px; }
        .command-list { background: var(--card-background-color); border-radius: 0 0 14px 14px; overflow: hidden; }
        .command-row { display: flex; align-items: center; justify-content: space-between; gap: 10px;
          padding: 13px 16px; cursor: pointer; border-bottom: 1px solid var(--divider-color); }
        .command-row:last-child { border-bottom: none; }
        .command-row:hover { background: var(--secondary-background-color); }
        .command-row .cmd-name { font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .command-row .cmd-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; color: var(--secondary-text-color); }
        .command-row .row-chevron { opacity: 1; font-size: 22px; line-height: 1; font-weight: 700;
          color: var(--primary-color); }
        .add-command-row { color: var(--primary-color); font-weight: 500; }
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
        .repo-footer { display: flex; justify-content: center; padding: 12px 0 4px; }
        .repo-footer a { display: inline-flex; align-items: center; gap: 6px; color: var(--secondary-text-color);
          font-size: 12px; text-decoration: none; }
        .repo-footer a:hover { color: var(--primary-color); text-decoration: underline; }
        .repo-footer svg { width: 14px; height: 14px; fill: currentColor; flex-shrink: 0; }
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

    // If we're drilled into a device, that view replaces everything else -
    // it's a plain list, on purpose (a grid of chips was hard to scan once
    // a device had more than a handful of commands).
    if (this._openDevice) {
      this._renderDeviceView(content);
      return;
    }

    this._renderDeviceGrid(content);
  }

  _renderDeviceGrid(content) {
    const t = this.t;
    const filter = this._filter;
    content.innerHTML = "";

    for (const remote of this._data) {
      const remoteEl = document.createElement("div");
      remoteEl.className = "remote";

      const header = document.createElement("div");
      header.className = "remote-header";
      header.innerHTML = `<span class="header-title">${this._escapeHtml(remote.friendly_name || remote.entity_id)}<span class="entity-id">${this._escapeHtml(remote.entity_id)}</span></span>`;
      const learnBtn = document.createElement("button");
      learnBtn.textContent = t.createDevice;
      learnBtn.onclick = () => this._createDeviceDialog(remote.entity_id);
      header.appendChild(learnBtn);
      remoteEl.appendChild(header);

      const deviceNames = Object.keys(remote.devices)
        .filter((d) => {
          if (!filter) return true;
          if (d.toLowerCase().includes(filter)) return true;
          return Object.keys(remote.devices[d]).some((c) => c.toLowerCase().includes(filter));
        })
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

      if (!deviceNames.length) {
        const empty = document.createElement("div");
        empty.className = "empty";
        empty.style.padding = "10px 16px";
        empty.textContent = t.noMatch;
        remoteEl.appendChild(empty);
        content.appendChild(remoteEl);
        continue;
      }

      const grid = document.createElement("div");
      grid.className = "device-grid";

      for (const device of deviceNames) {
        const commands = remote.devices[device];
        const commandCount = Object.keys(commands).length;
        const icon = this._deviceTypeIcon(this._effectiveDeviceType(remote, device));

        const tile = document.createElement("div");
        tile.className = "device-tile";
        tile.innerHTML = `
          <span class="tile-icon">${icon}</span>
          <span class="tile-name">${this._escapeHtml(device)}</span>
          <span class="tile-count">${commandCount}</span>
        `;
        tile.onclick = () => {
          this._openDevice = { entityId: remote.entity_id, device };
          this._renderContent();
        };
        grid.appendChild(tile);
      }

      remoteEl.appendChild(grid);
      content.appendChild(remoteEl);
    }

    // Repo link, main device-list page only (not shown once drilled into
    // a device) - the same convention other HACS custom integrations use
    // to point users back to the project's own GitHub page from inside
    // the running panel.
    const footer = document.createElement("div");
    footer.className = "repo-footer";
    footer.innerHTML = `
      <a href="${REPO_URL}" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
          0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01
          1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
          -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82
          2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
          0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
        <span>${t.repoLink}</span>
      </a>
    `;
    content.appendChild(footer);
  }

  _renderDeviceView(content) {
    const t = this.t;
    const { entityId, device } = this._openDevice;
    const remote = this._data.find((r) => r.entity_id === entityId);

    // The device could have just been deleted (e.g. from another client) -
    // fall back to the grid instead of showing a dead end.
    if (!remote || !remote.devices[device]) {
      this._openDevice = null;
      this._renderDeviceGrid(content);
      return;
    }

    const commands = remote.devices[device];
    const filter = this._filter;
    content.innerHTML = "";

    const wrap = document.createElement("div");
    wrap.className = "remote";

    const icon = this._deviceTypeIcon(this._effectiveDeviceType(remote, device));
    const viewHeader = document.createElement("div");
    viewHeader.className = "device-view-header";
    viewHeader.innerHTML = `
      <button class="back-btn" title="${t.back}"><svg viewBox="0 0 24 24"><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg></button>
      <span class="title">${icon} ${this._escapeHtml(device)}</span>
      <button class="icon-btn" id="dv-edit" title="${t.editDeviceTitle}"><svg viewBox="0 0 24 24"><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg></button>
      <button class="danger" id="dv-delete">${t.deleteDevice}</button>
    `;
    viewHeader.querySelector(".back-btn").onclick = () => {
      this._openDevice = null;
      this._renderContent();
    };
    viewHeader.querySelector("#dv-edit").onclick = () => this._editDeviceDialog(entityId, device);
    viewHeader.querySelector("#dv-delete").onclick = () => this._deleteDevice(entityId, device, commands);
    wrap.appendChild(viewHeader);

    const list = document.createElement("div");
    list.className = "command-list";

    for (const cmdName of Object.keys(commands)) {
      const cmdInfo = commands[cmdName];
      if (filter && !cmdName.toLowerCase().includes(filter)) continue;
      const codeList = cmdInfo.codes || [];
      const toggleBadge = cmdInfo.toggle
        ? `<span class="toggle-badge" title="${this._escapeHtml(t.toggle)} &times;${codeList.length}">&times;${codeList.length}</span>`
        : "";
      const row = document.createElement("div");
      row.className = "command-row";
      row.innerHTML = `
        <span class="cmd-name">${this._escapeHtml(cmdName)}</span>
        <span class="cmd-right">${toggleBadge}<span class="row-chevron">&#8250;</span></span>
      `;
      row.onclick = () => this._showCommandDetail(entityId, device, cmdName, cmdInfo);
      list.appendChild(row);
    }

    const addRow = document.createElement("div");
    addRow.className = "command-row add-command-row";
    addRow.innerHTML = `<span class="cmd-name">${this._escapeHtml(t.learn)}</span>`;
    addRow.onclick = () => this._learnCommand(entityId, device);
    list.appendChild(addRow);

    wrap.appendChild(list);
    content.appendChild(wrap);
  }
}

customElements.define("broadlink-codes-panel", BroadlinkCodesPanel);
