const dropZone = document.getElementById("drop-zone");
const dropContent = document.getElementById("drop-content");
const fileInfo = document.getElementById("file-info");
const fileInput = document.getElementById("file-input");
const fileName = document.getElementById("file-name");
const fileSize = document.getElementById("file-size");
const fileIcon = document.getElementById("file-icon");
const fileExt = document.getElementById("file-ext");
const changeBtn = document.getElementById("change-btn");
const spinner = document.getElementById("spinner");
const result = document.getElementById("result");
const output = document.getElementById("output");
const error = document.getElementById("error");
const errorMsg = document.getElementById("error-msg");
const copyBtn = document.getElementById("copy-btn");
const downloadBtn = document.getElementById("download-btn");

let currentFile = null;

const FILE_ICONS = {
  pdf: ["\u{1F4C4}", "PDF"],
  docx: ["\u{1F4DD}", "DOCX"],
  doc: ["\u{1F4DD}", "DOC"],
  pptx: ["\u{1F4CA}", "PPTX"],
  ppt: ["\u{1F4CA}", "PPT"],
  xlsx: ["\u{1F4CA}", "XLSX"],
  xls: ["\u{1F4CA}", "XLS"],
  csv: ["\u{1F4CA}", "CSV"],
  json: ["{ }", "JSON"],
  xml: ["</>", "XML"],
  html: ["</>", "HTML"],
  htm: ["</>", "HTML"],
  epub: ["\u{1F4DA}", "EPUB"],
  zip: ["\u{1F4E6}", "ZIP"],
  msg: ["\u{2709}", "MSG"],
  jpg: ["\u{1F5BC}", "JPG"],
  jpeg: ["\u{1F5BC}", "JPEG"],
  png: ["\u{1F5BC}", "PNG"],
  gif: ["\u{1F5BC}", "GIF"],
  webp: ["\u{1F5BC}", "WEBP"],
  bmp: ["\u{1F5BC}", "BMP"],
  mp3: ["\u{1F3B5}", "MP3"],
  wav: ["\u{1F3B5}", "WAV"],
  m4a: ["\u{1F3B5}", "M4A"],
  mp4: ["\u{1F3AC}", "MP4"],
  mov: ["\u{1F3AC}", "MOV"],
};

dropZone.addEventListener("click", () => fileInput.click());

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("drag-over");
});
dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("drag-over");
});
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drag-over");
  const f = e.dataTransfer.files[0];
  if (f) handleFile(f);
});

fileInput.addEventListener("change", () => {
  if (fileInput.files[0]) handleFile(fileInput.files[0]);
});

changeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  resetUI();
  fileInput.value = "";
});

function resetUI() {
  currentFile = null;
  dropContent.classList.remove("hidden");
  fileInfo.classList.add("hidden");
  result.classList.add("hidden");
  error.classList.add("hidden");
  spinner.classList.add("hidden");
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " o";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " Ko";
  return (bytes / 1048576).toFixed(1) + " Mo";
}

function handleFile(file) {
  currentFile = file;
  dropContent.classList.add("hidden");
  fileInfo.classList.remove("hidden");
  result.classList.add("hidden");
  error.classList.add("hidden");

  const ext = file.name.split(".").pop().toLowerCase();
  const iconData = FILE_ICONS[ext] || ["\u{1F4C4}", ext.toUpperCase()];
  fileIcon.textContent = iconData[0];
  fileExt.textContent = iconData[1];
  fileName.textContent = file.name;
  fileSize.textContent = formatSize(file.size);

  convertFile(file);
}

async function convertFile(file) {
  spinner.classList.remove("hidden");
  result.classList.add("hidden");
  error.classList.add("hidden");

  const form = new FormData();
  form.append("file", file);

  try {
    const res = await fetch("/convert", { method: "POST", body: form });
    spinner.classList.add("hidden");

    if (!res.ok) {
      const detail = (await res.json()).detail || `Erreur ${res.status}`;
      showError(detail);
      return;
    }

    const data = await res.json();
    output.textContent = data.text;
    result.classList.remove("hidden");
  } catch (err) {
    spinner.classList.add("hidden");
    showError("Erreur de connexion au serveur.");
  }
}

function showError(msg) {
  errorMsg.textContent = msg;
  error.classList.remove("hidden");
}

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(output.textContent);
    copyBtn.textContent = "\u{2713}";
    copyBtn.style.color = "var(--success)";
    setTimeout(() => { copyBtn.innerHTML = "&#x2398;"; copyBtn.style.color = ""; }, 1500);
  } catch {
    showError("Impossible de copier dans le presse-papier.");
  }
});

downloadBtn.addEventListener("click", () => {
  if (!currentFile) return;
  const name = currentFile.name.replace(/\.[^.]+$/, "") + ".md";
  downloadText(name);
});

function downloadText(name) {
  const blob = new Blob([output.textContent], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

// ── URL converter ──
const urlInput = document.getElementById("url-input");
const urlBtn = document.getElementById("url-btn");

urlBtn.addEventListener("click", () => convertUrl());
urlInput.addEventListener("keydown", (e) => { if (e.key === "Enter") convertUrl(); });

async function convertUrl() {
  const url = urlInput.value.trim();
  if (!url) return;

  spinner.classList.remove("hidden");
  result.classList.add("hidden");
  error.classList.add("hidden");

  const form = new FormData();
  form.append("url", url);

  try {
    const res = await fetch("/convert_url", { method: "POST", body: form });
    spinner.classList.add("hidden");

    if (!res.ok) {
      const detail = (await res.json()).detail || `Erreur ${res.status}`;
      showError(detail);
      return;
    }

    const data = await res.json();
    output.textContent = data.text;
    result.classList.remove("hidden");
    currentFile = { name: new URL(url).hostname + ".md" };
  } catch (err) {
    spinner.classList.add("hidden");
    showError("Erreur de connexion au serveur.");
  }
}
