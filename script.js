// ===== Stato base =====
const icons = document.querySelectorAll(".icon");
const windows = document.querySelectorAll(".window");
const taskbar = document.getElementById("taskbar-apps");
const clock = document.getElementById("clock");
const osRoot = document.getElementById("os");
const startButton = document.getElementById("start-button");
const startMenu = document.getElementById("start-menu");
const startApps = document.querySelectorAll(".start-app");
const startPowerButtons = document.querySelectorAll(".start-power");
const dockItems = document.querySelectorAll(".dock-item");
const splash = document.getElementById("splash");
const blackScreen = document.getElementById("black-screen");
const blackIcon = document.getElementById("black-icon");
const standbyOverlay = document.getElementById("standby-message");
const standbyText = document.getElementById("standby-text");

let zIndexCounter = 10;
let currentLang = "en";
let isInStandby = false;

// ===== Traduzioni =====
const i18n = {
  en: {
    win_notes_title: "Notes",
    win_browser_title: "Mini Browser",
    win_files_title: "Files",
    win_music_title: "Music Player",
    win_terminal_title: "Terminal",
    win_about_title: "System Info",
    win_settings_title: "Settings",
    notes_placeholder: "Write your notes here...",
    browser_placeholder: "fake address… (no real navigation)",
    browser_welcome:
      '<h3>Welcome to NamixOS</h3><p>This is a demo web OS running entirely in your browser.</p>',
    about_content:
      "<h2>NamixOS</h2><p>Mini web operating system, running fully client‑side.</p><ul><li><strong>Windows:</strong> drag, minimize, fullscreen</li><li><strong>Apps:</strong> Notes, Browser, Files, Music, Terminal, Info</li><li><strong>Mobile:</strong> auto fullscreen, tap to open</li></ul>",
    settings_theme_title: "Theme",
    settings_theme_dark: "Dark theme",
    settings_theme_light: "Light theme",
    settings_language_title: "Language",
    settings_mobile_note:
      "On phones windows are automatically fullscreen and opened with a single tap.",
    dock_browser: "Browser",
    dock_files: "Files",
    dock_terminal: "Terminal",
    music_note: "This is a visual music player only (no real audio).",
    fm_quick_access: "Quick access",
    fm_home: "Home",
    fm_documents: "Documents",
    fm_music: "Music",
    fm_path: "Path:",
    power_title: "Power",
    power_standby: "Standby",
    power_reboot: "Restart system",
    confirm_standby: "Do you want to enter standby mode?",
    confirm_reboot: "Restart the system?",
    standby_message: "Namix is in standby. Tap the screen to wake up.",
    icon: {
      notes: "Notes",
      browser: "Browser",
      files: "Files",
      music: "Music",
      terminal: "Terminal",
      about: "About OS"
    },
    terminal_welcome:
      "Welcome to NamixOS terminal.\nType 'help' to see available commands.\n",
    terminal_help:
      "Available commands: help, about, clear, apps, ls, cd, open, lang, date",
    terminal_about: "NamixOS - demo web OS. Powered by SOLEN.",
    terminal_unknown: "Command not recognized:",
    terminal_apps:
      "Apps: notes, browser, files, music, terminal, about, settings",
    terminal_ls_root: "home",
    terminal_ls_home: "Documents  Music  todo.txt  ideas.txt",
    terminal_ls_docs: "spec.md  notes.txt",
    terminal_ls_music: "track1.mp3  track2.mp3",
    terminal_cd_ok: "Moved to:",
    terminal_cd_fail: "No such directory:",
    terminal_open_fail: "Unknown app:",
    terminal_lang_set: "Language set to",
    terminal_prompt_base: "user@namix"
  }
};

function getDict() {
  return i18n[currentLang];
}

function applyTranslations() {
  const dict = getDict();

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key]) el.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.dataset.i18nHtml;
    if (dict[key]) el.innerHTML = dict[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (dict[key]) el.placeholder = dict[key];
  });

  document.querySelectorAll("[data-i18n-icon]").forEach((el) => {
    const key = el.dataset.i18nIcon;
    if (dict.icon && dict.icon[key]) {
      const label = el.querySelector(".icon-label");
      if (label) label.textContent = dict.icon[key];
    }
  });

  const dockBrowser = document.querySelector('[data-i18n="dock_browser"]');
  const dockFiles = document.querySelector('[data-i18n="dock_files"]');
  const dockTerminal = document.querySelector('[data-i18n="dock_terminal"]');
  if (dockBrowser) dockBrowser.textContent = dict.dock_browser;
  if (dockFiles) dockFiles.textContent = dict.dock_files;
  if (dockTerminal) dockTerminal.textContent = dict.dock_terminal;

  const prompt = document.getElementById("terminal-prompt");
  if (prompt) {
    prompt.textContent = `${dict.terminal_prompt_base}:~$`;
  }

  if (standbyText) standbyText.textContent = dict.standby_message;
}

// ===== Splash intro =====
function playSplash(callback) {
  if (!splash) {
    if (callback) callback();
    return;
  }
  splash.classList.add("visible");
  splash.style.display = "flex";
  setTimeout(() => {
    splash.classList.remove("visible");
    splash.style.display = "none";
    if (callback) callback();
  }, 2800);
}
// ===== Icone desktop e dock =====
icons.forEach((icon) => {
  icon.addEventListener("dblclick", () => {
    const id = icon.dataset.window;
    if (id) openWindow(id);
  });

  icon.addEventListener("click", () => {
    if (window.innerWidth <= 700) {
      const id = icon.dataset.window;
      if (id) openWindow(id);
    }
  });
});

dockItems.forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.window;
    if (id) openWindow(id);
  });
});

// ===== Start menu =====
function toggleStartMenu() {
  const isOpen = startMenu.classList.contains("open");
  startMenu.classList.toggle("open", !isOpen);
  startButton.classList.toggle("active", !isOpen);
}

startButton.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleStartMenu();
});

startApps.forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.window;
    if (id) openWindow(id);
    startMenu.classList.remove("open");
    startButton.classList.remove("active");
  });
});

document.addEventListener("click", (e) => {
  if (!startMenu.contains(e.target) && e.target !== startButton) {
    startMenu.classList.remove("open");
    startButton.classList.remove("active");
  }
});

// ===== Bottoni finestra + drag =====
windows.forEach((win) => {
  const btnClose = win.querySelector(".btn-close");
  const btnMin = win.querySelector(".btn-minimize");
  const btnFull = win.querySelector(".btn-fullscreen");
  const titlebar = win.querySelector(".window-titlebar");

  if (btnClose) {
    btnClose.addEventListener("click", (e) => {
      e.stopPropagation();
      closeWindow(win);
    });
  }

  if (btnMin) {
    btnMin.addEventListener("click", (e) => {
      e.stopPropagation();
      minimizeWindow(win);
    });
  }

  if (btnFull) {
    btnFull.addEventListener("click", (e) => {
      e.stopPropagation();
      win.classList.toggle("fullscreen");
      if (win.style.display !== "none") {
        focusWindow(win);
      }
    });
  }

  if (titlebar) {
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const startDrag = (e) => {
      if (window.innerWidth <= 700 || win.classList.contains("fullscreen"))
        return;
      dragging = true;
      focusWindow(win);
      const rect = win.getBoundingClientRect();
      const clientX = e.clientX ?? e.touches?.[0]?.clientX;
      const clientY = e.clientY ?? e.touches?.[0]?.clientY;
      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;
      e.preventDefault();
    };

    const doDrag = (e) => {
      if (!dragging) return;
      const clientX = e.clientX ?? e.touches?.[0]?.clientX;
      const clientY = e.clientY ?? e.touches?.[0]?.clientY;
      win.style.left = clientX - offsetX + "px";
      win.style.top = clientY - offsetY + "px";
    };

    const stopDrag = () => {
      dragging = false;
    };

    titlebar.addEventListener("mousedown", startDrag);
    titlebar.addEventListener("touchstart", startDrag, { passive: false });
    document.addEventListener("mousemove", doDrag);
    document.addEventListener("touchmove", doDrag, { passive: false });
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchend", stopDrag);

    win.addEventListener("mousedown", () => focusWindow(win));
    win.addEventListener("touchstart", () => focusWindow(win));
  }
});

// ===== Clock =====
function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  clock.textContent = `${hh}:${mm}`;
}
updateClock();
setInterval(updateClock, 30000);

// ===== Tema e lingua =====
document.querySelectorAll(".btn-theme").forEach((btn) => {
  btn.addEventListener("click", () => {
    osRoot.classList.toggle("light-theme", btn.dataset.theme === "light");
  });
});

document.querySelectorAll(".btn-lang").forEach((btn) => {
  btn.addEventListener("click", () => {
    const lang = btn.dataset.lang;
    if (lang && i18n[lang]) {
      currentLang = lang;
      applyTranslations();
    }
  });
});
// ===== Mobile fullscreen =====
function mobileMode() {
  const isMobile = window.innerWidth <= 700;
  windows.forEach((win) => {
    if (win.style.display !== "none") {
      win.classList.toggle("fullscreen", isMobile);
    }
  });
}
window.addEventListener("resize", mobileMode);
mobileMode();

// ===== Standby & Reboot =====
function showBlackSequence(iconSymbol, duration = 3000, callback) {
  if (!blackScreen || !blackIcon) {
    if (callback) callback();
    return;
  }

  blackIcon.textContent = iconSymbol;
  blackScreen.style.display = "flex";
  blackScreen.classList.add("visible");

  setTimeout(() => {
    blackScreen.classList.remove("visible");
    blackScreen.style.display = "none";
    if (callback) callback();
  }, duration);
}

function enterStandby() {
  const dict = getDict();
  const ok = window.confirm(dict.confirm_standby);
  if (!ok) return;

  startMenu.classList.remove("open");
  startButton.classList.remove("active");
  closeAllWindows();

  showBlackSequence("⏸", 3000, () => {
    standbyOverlay.style.display = "flex";
    standbyOverlay.classList.add("visible");
    isInStandby = true;
  });
}

function wakeFromStandby() {
  if (!isInStandby) return;
  isInStandby = false;

  standbyOverlay.classList.remove("visible");
  standbyOverlay.style.display = "none";

  showBlackSequence("⏸", 3000, () => {
    playSplash(() => {});
  });
}

if (standbyOverlay) {
  standbyOverlay.addEventListener("click", wakeFromStandby);
  standbyOverlay.addEventListener("touchstart", (e) => {
    e.preventDefault();
    wakeFromStandby();
  }, { passive: false });
}

function enterReboot() {
  const dict = getDict();
  const ok = window.confirm(dict.confirm_reboot);
  if (!ok) return;

  startMenu.classList.remove("open");
  startButton.classList.remove("active");
  closeAllWindows();

  showBlackSequence("🔄", 3000, () => {
    playSplash(() => {});
  });
}

startPowerButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    if (action === "standby") enterStandby();
    if (action === "reboot") enterReboot();
  });
});

// ===== Init =====
applyTranslations();
if (blackScreen) blackScreen.style.display = "none";
if (standbyOverlay) standbyOverlay.style.display = "none";
playSplash(() => {});
