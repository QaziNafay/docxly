"use strict";

const els = {
  file: document.getElementById("file"),
  fileLabel: document.getElementById("fileLabel"),
  includeSubheadings: document.getElementById("includeSubheadings"),
  run: document.getElementById("run"),
  download: document.getElementById("download"),
  log: document.getElementById("log"),
  serviceUrl: document.getElementById("serviceUrl"),
  apiKey: document.getElementById("apiKey"),
  save: document.getElementById("save"),
  test: document.getElementById("test"),
};

const STORAGE = "docxly.settings";
let selectedFile = null;
let resultUrl = null;

function log(message) {
  els.log.textContent = message;
}

function serviceUrl() {
  return els.serviceUrl.value.trim().replace(/\/+$/, "");
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE) || "{}");
    els.serviceUrl.value = saved.serviceUrl || "";
    els.apiKey.value = saved.apiKey || "";
  } catch {
    /* ignore */
  }
}

function saveSettings() {
  localStorage.setItem(
    STORAGE,
    JSON.stringify({ serviceUrl: serviceUrl(), apiKey: els.apiKey.value.trim() })
  );
  log("Settings saved in this browser.");
}

function outputName(inputName) {
  return inputName.replace(/\.docx$/i, "") + "_docxly.docx";
}

els.file.addEventListener("change", () => {
  selectedFile = els.file.files && els.file.files[0] ? els.file.files[0] : null;
  els.fileLabel.textContent = selectedFile
    ? selectedFile.name + " (" + Math.round(selectedFile.size / 1024) + " KB)"
    : "Click to choose a .docx file";
});

els.save.addEventListener("click", saveSettings);

els.test.addEventListener("click", async () => {
  const url = serviceUrl();
  if (!url) {
    log("Enter a Service URL first.");
    return;
  }
  log("Testing " + url + " ...");
  try {
    const response = await fetch(url + "/health");
    const body = await response.json();
    log(
      response.ok
        ? "Service reachable: " + JSON.stringify(body)
        : "Service responded " + response.status
    );
  } catch (error) {
    log("Cannot reach service: " + error.message);
  }
});

els.run.addEventListener("click", async () => {
  if (!selectedFile) {
    log("Choose a .docx file first.");
    return;
  }
  const url = serviceUrl();
  if (!url) {
    log("Open Settings and enter the Service URL.");
    return;
  }

  const form = new FormData();
  form.append("file", selectedFile);
  form.append("include_subheadings", els.includeSubheadings.checked ? "true" : "false");

  const headers = {};
  const key = els.apiKey.value.trim();
  if (key) {
    headers["X-Api-Key"] = key;
  }

  els.run.disabled = true;
  log("Running…");
  try {
    const response = await fetch(url + "/bold-headings", {
      method: "POST",
      body: form,
      headers,
    });

    if (!response.ok) {
      let message = response.status + " " + response.statusText;
      try {
        const body = await response.json();
        if (body && body.error) {
          message = body.error;
        }
      } catch {
        /* not JSON */
      }
      throw new Error(message);
    }

    const blob = await response.blob();
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
    }
    resultUrl = URL.createObjectURL(blob);
    els.download.href = resultUrl;
    els.download.setAttribute("download", outputName(selectedFile.name));
    els.download.classList.remove("disabled");

    const changed = response.headers.get("X-Changed");
    const headings = response.headers.get("X-Heading-Count");
    const details = [];
    if (headings) details.push("headings: " + headings);
    if (changed) details.push("changed: " + changed);
    log("Done. Ready to download." + (details.length ? " (" + details.join(", ") + ")" : ""));
  } catch (error) {
    log("Error: " + error.message);
  } finally {
    els.run.disabled = false;
  }
});

loadSettings();
