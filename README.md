# Docxly

**Automatic, private formatting for MS Word Docx files.**

**[Live demo](https://qazinafay.github.io/docxly/)** - upload a Word Docx file and bold the headings right in your browser. No sign up, nothing uploaded.

> Note: English is not my first language, so some wording may be imperfect.

## Why Docxly

Formatting document files when you are in a hurry can be quite a daunting and
laborious activity. This tool was made to address that, so you can save some
time for yourself or your family, and let the tool do the laborious work.

## What it does

Docxly takes a Word Docx file, applies one formatting job, and returns a new
Word Docx file with only that change made. Everything else in the document is
preserved.

The first job is **Bold headings**: Docxly finds the headings and subheadings in
the body of the document and makes them bold. Front matter (the setup region at
the start of a document) is left untouched, and a heading that introduces a list
is handled as part of that list.

- **Private.** The web app runs in your browser, so your document never leaves
  your computer. No AI service is involved.
- **Preservation-first.** Only the requested formatting changes. Text, tables,
  styles, headers, footers, and everything else come back unchanged.
- **Works on real documents.** Handles documents with weak, missing, or
  inconsistent Word styles, the kind that trip up generic tools.

## Live demo

Open **https://qazinafay.github.io/docxly/**

1. Choose a `.docx` file.
2. Leave "Bold subheadings too" checked, or turn it off.
3. Click **Run**.
4. Click **Download result**.

Everything runs locally in your browser. The first load takes a few seconds.

## Microsoft Word add-in

**Docxly - Automated** also runs inside Word as an add-in. It bolds the headings
and subheadings in the body of the open document.

See [`ADDIN_SETUP.md`](ADDIN_SETUP.md) for how to test it and how to publish it
so it appears in the Word add-in library.

## Configuration and API

See [`CONFIGURATION.md`](CONFIGURATION.md) for the web app options and for the
API (for developers who want to run the service themselves).

## Privacy

- The web app processes your file in the browser and does not upload it.
- Documents are not sent to AI providers and are not used for training.

## Support

If Docxly saves you time, you can support the project:

**[Support me on Ko-fi](https://ko-fi.com/QaziNafay)**

## Links

- Live demo: https://qazinafay.github.io/docxly/
- Plans: [`pricing.html`](pricing.html)
- Configuration: [`CONFIGURATION.md`](CONFIGURATION.md)

---

© Docxly. Microsoft and Word are trademarks of Microsoft Corporation. Docxly is not affiliated with Microsoft.
