/* ===========================
   FILE MANAGER
=========================== */

const fileSystem = {
  home: ["notes.txt", "todo.txt", "image.png"],
  documents: ["project.docx", "resume.pdf"],
  music: ["demo-track.mp3"]
};

const fmList = document.getElementById("fm-list");
const fmPath = document.getElementById("fm-path");

function loadFolder(path) {
  if (!fileSystem[path]) return;
  fmPath.textContent = path;
  fmList.innerHTML = "";

  fileSystem[path].forEach(item => {
    const div = document.createElement("div");
    div.className = "fm-item";
    div.textContent = item;
    fmList.appendChild(div);
  });
}

document.querySelectorAll(".fm-nav-item").forEach(btn => {
  btn.addEventListener("click", () => loadFolder(btn.dataset.path));
});

if (fmList && fmPath) {
  loadFolder("home");
}

/* ===========================
   TERMINAL
=========================== */

const termOutput = document.getElementById("terminal-output");
const termInput = document.querySelector(".terminal-input");

function termPrint(text) {
  termOutput.innerHTML += text + "\n";
  termOutput.scrollTop = termOutput.scrollHeight;
}

function runCommand(cmd) {
  const parts = cmd.trim().split(" ");
  const base = parts[0];

  switch (base) {
    case "help":
      termPrint("Commands:\nhelp\nls\ncd <folder>\nopen <app>\nclear\nabout");
      break;

    case "ls":
      termPrint("home  documents  music");
      break;

    case "cd":
      if (!parts[1]) termPrint("Usage: cd <folder>");
      else if (fileSystem[parts[1]]) termPrint("Moved to " + parts[1]);
      else termPrint("Folder not found");
      break;

    case "open":
      if (!parts[1]) {
        termPrint("Usage: open <app>");
      } else {
        const id = "win-" + parts[1];
        if (document.getElementById(id)) {
          openWindow(id);
          termPrint("Opening " + parts[1] + "...");
        } else termPrint("App not found");
      }
      break;

    case "clear":
      termOutput.innerHTML = "";
      break;

    case "about":
      termPrint("NamixOS Terminal\nPowered by SOLEN.");
      break;

    default:
      if (base) termPrint("Unknown command: " + base);
  }
}

if (termInput && termOutput) {
  termInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      const cmd = termInput.value;
      termPrint("$ " + cmd);
      runCommand(cmd);
      termInput.value = "";
    }
  });
}

/* ===========================
   BROWSER
=========================== */

const browserUrl = document.querySelector(".browser-url");
if (browserUrl) {
  browserUrl.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      const view = document.querySelector(".browser-view");
      if (!view) return;
      view.innerHTML = `
        <h3>Navigation disabled</h3>
        <p>This is a demo browser. No real navigation is available.</p>
      `;
    }
  });
}

/* ===========================
   SETTINGS: TABS
=========================== */

const tabs = document.querySelectorAll(".settings-tab");
const pages = document.querySelectorAll(".settings-page");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    pages.forEach(p => p.classList.remove("active"));
    const page = document.getElementById("settings-" + tab.dataset.tab);
    if (page) page.classList.add("active");
  });
});

// default page
const defaultPage = document.getElementById("settings-lang");
if (defaultPage) defaultPage.classList.add("active");

/* ===========================
   WALLPAPERS
=========================== */

const wallpapers = [
  "wallpapers/wall1.jpg",
  "wallpapers/wall2.jpg",
  "wallpapers/wall3.jpg",
  "wallpapers/wall4.jpg",
  "wallpapers/wall5.jpg"
];

const grid = document.getElementById("wallpaper-grid");
const desktop = document.getElementById("desktop");

if (grid && desktop) {
  wallpapers.forEach(src => {
    const div = document.createElement("div");
    div.className = "wallpaper-thumb";
    div.style.backgroundImage = `url(${src})`;

    div.addEventListener("click", () => {
      desktop.style.background = `url(${src}) center/cover no-repeat`;
    });

    grid.appendChild(div);
  });
}

/* ===========================
   NOTES APP
=========================== */

let notes = [];
let activeNoteId = null;

const notesList = document.getElementById("notes-list");
const noteTitleInput = document.getElementById("note-title");
const noteBodyInput = document.getElementById("note-body");
const btnNewNote = document.getElementById("btn-new-note");
const btnDeleteNote = document.getElementById("btn-delete-note");
const btnDownloadNote = document.getElementById("btn-download-note");

function renderNotesList() {
  if (!notesList) return;
  notesList.innerHTML = "";
  notes.forEach(note => {
    const li = document.createElement("li");
    li.textContent = note.title || "Untitled";
    li.dataset.id = note.id;
    if (note.id === activeNoteId) li.classList.add("active");
    li.addEventListener("click", () => {
      saveActiveNote();
      setActiveNote(note.id);
    });
    notesList.appendChild(li);
  });
}

function setActiveNote(id) {
  activeNoteId = id;
  const note = notes.find(n => n.id === id);
  if (!note) return;
  if (noteTitleInput) noteTitleInput.value = note.title;
  if (noteBodyInput) noteBodyInput.value = note.body;
  renderNotesList();
}

function saveActiveNote() {
  if (!activeNoteId) return;
  const note = notes.find(n => n.id === activeNoteId);
  if (!note) return;
  note.title = noteTitleInput ? noteTitleInput.value : note.title;
  note.body = noteBodyInput ? noteBodyInput.value : note.body;
}

function createNewNote() {
  saveActiveNote();
  const id = "note-" + Date.now();
  const newNote = {
    id,
    title: "New note",
    body: ""
  };
  notes.unshift(newNote);
  activeNoteId = id;
  renderNotesList();
  if (noteTitleInput) noteTitleInput.value = newNote.title;
  if (noteBodyInput) noteBodyInput.value = newNote.body;
}

function deleteActiveNote() {
  if (!activeNoteId) return;
  notes = notes.filter(n => n.id !== activeNoteId);
  activeNoteId = notes.length ? notes[0].id : null;
  if (activeNoteId) {
    const note = notes[0];
    if (noteTitleInput) noteTitleInput.value = note.title;
    if (noteBodyInput) noteBodyInput.value = note.body;
  } else {
    if (noteTitleInput) noteTitleInput.value = "";
    if (noteBodyInput) noteBodyInput.value = "";
  }
  renderNotesList();
}

function downloadActiveNote() {
  const note = notes.find(n => n.id === activeNoteId);
  if (!note) return;

  const content = note.title + "\n\n" + note.body;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeTitle = note.title || "note";
  a.download = safeTitle.replace(/[^a-z0-9_\-]/gi, "_") + ".txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

if (btnNewNote) {
  btnNewNote.addEventListener("click", createNewNote);
}

if (btnDeleteNote) {
  btnDeleteNote.addEventListener("click", deleteActiveNote);
}

if (btnDownloadNote) {
  btnDownloadNote.addEventListener("click", () => {
    saveActiveNote();
    downloadActiveNote();
  });
}

if (noteTitleInput) {
  noteTitleInput.addEventListener("input", () => {
    if (!activeNoteId) return;
    const note = notes.find(n => n.id === activeNoteId);
    if (!note) return;
    note.title = noteTitleInput.value;
    renderNotesList();
  });
}

if (noteBodyInput) {
  noteBodyInput.addEventListener("input", () => {
    if (!activeNoteId) return;
    const note = notes.find(n => n.id === activeNoteId);
    if (!note) return;
    note.body = noteBodyInput.value;
  });
}

// init with one default note
if (notesList && noteTitleInput && noteBodyInput) {
  notes.push({
    id: "note-1",
    title: "Welcome",
    body: "This is your first note in NamixOS."
  });
  activeNoteId = "note-1";
  renderNotesList();
  noteTitleInput.value = notes[0].title;
  noteBodyInput.value = notes[0].body;
}
