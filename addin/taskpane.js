// Docxly - Automated (Word task pane add-in).
//
// Bolds the headings and subheadings in the main body of the open document.
// Rules mirror the Docxly engine:
//   - a heading run is 1 to 3 short lines (1 to 8 words each),
//   - 4 or more short lines in a row is treated as poetry, not headings,
//   - front matter is skipped (headings before the repeated heading/body rhythm),
//   - body text and list paragraphs are left alone.

let logEl;

Office.onReady(function (info) {
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

function normalize(value) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function wordCount(value) {
  const text = normalize(value);
  return text ? text.split(" ").length : 0;
}

function isListStyle(styleName) {
  return /list/i.test(styleName || "");
}

function isBullet(text) {
  return /^[-*•]\s/.test(text);
}

function isHeadingLike(item) {
  const text = item.text;
  if (!text) {
    return false;
  }
  if (isListStyle(item.style)) {
    return false;
  }
  if (isBullet(text)) {
    return false;
  }
  const count = wordCount(text);
  return count >= 1 && count <= 8;
}

// Runs of consecutive heading-like lines.
function headingRuns(items) {
  const runs = [];
  let i = 0;
  while (i < items.length) {
    if (!isHeadingLike(items[i])) {
      i += 1;
      continue;
    }
    let end = i;
    while (end + 1 < items.length && isHeadingLike(items[end + 1])) {
      end += 1;
    }
    runs.push({ start: i, end: end });
    i = end + 1;
  }
  return runs;
}

// First heading run that starts the repeated heading -> body rhythm.
function mainBodyStart(items, runs) {
  for (let r = 0; r < runs.length; r++) {
    const run = runs[r];
    const afterRun = run.end + 1;
    if (afterRun >= items.length || isHeadingLike(items[afterRun])) {
      continue;
    }
    for (let s = r + 1; s < runs.length; s++) {
      const next = runs[s];
      const nextAfter = next.end + 1;
      if (nextAfter < items.length && !isHeadingLike(items[nextAfter])) {
        return run.start;
      }
    }
  }
  return 0;
}

function selectTargets(items, includeSubheadings) {
  const runs = headingRuns(items);
  const start = mainBodyStart(items, runs);
  const targets = [];

  for (const run of runs) {
    if (run.start < start) {
      continue;
    }
    const length = run.end - run.start + 1;
    if (length < 1 || length > 3) {
      continue; // 4+ short lines: poetry, not headings
    }
    targets.push(run.start);
    if (includeSubheadings) {
      for (let k = run.start + 1; k <= run.end; k++) {
        targets.push(k);
      }
    }
  }

  return targets;
}

function run() {
  const button = document.getElementById("run");
  const includeSubheadings = document.getElementById("includeSubheadings").checked;
  button.disabled = true;
  log("Working...");

  Word.run(function (context) {
    const paragraphs = context.document.body.paragraphs;
    paragraphs.load("items/text,items/style");
    return context.sync().then(function () {
      const items = paragraphs.items.map(function (p) {
        return { text: normalize(p.text), style: p.style };
      });

      const targetIndexes = selectTargets(items, includeSubheadings);
      for (let t = 0; t < targetIndexes.length; t++) {
        paragraphs.items[targetIndexes[t]].font.bold = true;
      }

      return context.sync().then(function () {
        log(
          targetIndexes.length > 0
            ? "Done. Bolded " + targetIndexes.length + " heading(s)."
            : "No headings found in the main body."
        );
      });
    });
  })
    .catch(function (error) {
      log("Error: " + (error && error.message ? error.message : String(error)));
    })
    .then(function () {
      button.disabled = false;
    });
}
