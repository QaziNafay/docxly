// Docxly - Automated (Word task pane add-in).
//
// Automated version: bolds the headings and subheadings in the body of the
// open document, leaving front matter, body text, and lists alone.
//
// The structure rules match the Docxly engine (heading runs of 1-3 short
// lines, front matter skipped). This task pane is the v1 implementation that
// runs against Word's object model; the full C# engine runs in the browser
// build of Docxly.

let logEl;

Office.onReady((info) => {
  logEl = document.getElementById("log");
  if (info.host === Office.HostType.Word) {
    document.getElementById("run").addEventListener("click", run);
    log("Ready.");
  } else {
    log("Open this add-in from Microsoft Word.");
  }
});

function log(message) {
  if (logEl) {
    logEl.textContent = message;
  }
}

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function isShort(text) {
  const count = wordCount(text);
  return count >= 1 && count <= 8;
}

function isListParagraph(styleName) {
  return /list/i.test(styleName || "");
}

// First heading that begins a repeated heading -> body rhythm.
function mainBodyStart(items) {
  for (let i = 0; i < items.length; i++) {
    if (!isShort(items[i].text) || i + 1 >= items.length) {
      continue;
    }
    if (isShort(items[i + 1].text)) {
      continue;
    }
    for (let j = i + 2; j < items.length - 1; j++) {
      if (isShort(items[j].text) && !isShort(items[j + 1].text)) {
        return i;
      }
    }
  }
  return 0;
}

function selectTargets(items, includeSubheadings) {
  const start = mainBodyStart(items);
  const runs = [];
  let run = [];

  for (let i = start; i < items.length; i++) {
    const item = items[i];
    const text = item.text.trim();
    const short =
      text.length > 0 &&
      isShort(text) &&
      !/^[-*•]\s/.test(text) &&
      !isListParagraph(item.styleName);

    if (short) {
      run.push(i);
    } else {
      if (run.length >= 1 && run.length <= 3) {
        runs.push(run);
      }
      run = [];
    }
  }
  if (run.length >= 1 && run.length <= 3) {
    runs.push(run);
  }

  const targets = [];
  for (const headingRun of runs) {
    targets.push(includeSubheadings ? headingRun[0] : headingRun[0]);
    if (includeSubheadings) {
      for (let k = 1; k < headingRun.length; k++) {
        targets.push(headingRun[k]);
      }
    }
  }
  return targets;
}

async function run() {
  const button = document.getElementById("run");
  const includeSubheadings = document.getElementById("includeSubheadings").checked;
  button.disabled = true;
  log("Working...");

  try {
    await Word.run(async (context) => {
      const paragraphs = context.document.body.paragraphs;
      paragraphs.load("items/text");
      await context.sync();

      const items = paragraphs.items.map((p) => ({ text: p.text, styleName: "" }));
      const targetIndexes = selectTargets(items, includeSubheadings);

      for (const index of targetIndexes) {
        paragraphs.items[index].font.bold = true;
      }
      await context.sync();

      log("Done. Bolded " + targetIndexes.length + " heading(s).");
    });
  } catch (error) {
    log("Error: " + (error && error.message ? error.message : String(error)));
  } finally {
    button.disabled = false;
  }
}
