# Docxly

**Automatic, private formatting for MS Word Docx files.**

> Note: I am not a native English speaker. This project's text was written with
> the help of AI tools, so some wording may read awkwardly. Corrections and
> clearer phrasing are welcome.

Docxly takes a Word Docx file, applies a formatting job, and returns a new Word Docx file with only that change made. Everything else in the document is preserved.

The first job available is **Bold headings** - Docxly finds the headings and subheadings in the body of the document and makes them bold, leaving front matter, body text, lists, and every other formatting property exactly as they were.

## Why Docxly

- **Private.** Your document is never sent to a third-party AI service. Processing is deterministic.
- **Preservation-first.** Only the requested formatting changes. Text, tables, styles, headers, footers, and untouched content come back unchanged.
- **Works on real documents.** Handles documents with weak, missing, or inconsistent Word styles - the kind that trip up generic tools.

## Quick start

### Web app
1. Open the Docxly web app.
2. Upload your `.docx`.
3. Choose the job (default: **Bold headings**).
4. Run it and download the result.

See [`CONFIGURATION.md`](CONFIGURATION.md) for every setting.

### API
```bash
curl -X POST "https://<your-docxly-host>/bold-headings" \
  -F "file=@document.docx" \
  --output formatted.docx
```

## Privacy
- Documents are not used for training.
- Documents are not sent to external AI providers.
- Uploaded files are processed for the request and are not retained.

## Links
- Configuration and setup: [`CONFIGURATION.md`](CONFIGURATION.md)

---

© Docxly. Microsoft and Word are trademarks of Microsoft Corporation. Docxly is not affiliated with Microsoft.
