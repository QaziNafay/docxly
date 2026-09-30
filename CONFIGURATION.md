# Docxly - Configuration Guide

Docxly formats **MS Word Docx files** (`.docx`). This guide explains how to
configure it for the **web app** and for the **software/API service**. It
describes behavior and settings only.

---

## 1. Web app

The web app is a browser tool: upload a document, choose a job, download the
result. No install required.

### 1.1 Connect to a service
Open the app. It connects to a Docxly service automatically.

To point the app at a different service:

1. Open **Settings** (gear icon).
2. Set **Service URL** to your service address, for example:
   ```
   https://docxly.example.com
   ```
3. If your service requires a key, enter it under **API key**.
4. Click **Test connection**. A green status means the app can reach the service.

### 1.2 Jobs and options

| Option | Default | What it does |
|---|---|---|
| **Bold headings** | On | Makes headings and subheadings in the document body bold. |
| **Include subheadings** | On | When off, only top-level headings are bolded. |
| **Front matter** | Skipped (fixed) | The setup region at the start of a document is never modified. |

Notes:
- A heading followed by a list is treated as the **title of that list** and is
  handled as part of the list, not as a body heading.
- Only the requested change is applied. Text, lists, tables, headers, footers,
  and all other formatting are preserved.

### 1.3 Run a document
1. **Choose file** → select a `.docx`.
2. Confirm the job and options.
3. **Run**. A progress state is shown.
4. **Download** the formatted `.docx` when ready.

### 1.4 Browser requirements
- Current Chrome, Edge, Firefox, or Safari.
- JavaScript enabled.
- Only `.docx` files are accepted. `.doc`, PDF, and other formats are not.

---

## 2. Software / self-hosted service

The Docxly service is a small web service. Run it where you want documents
processed (your machine, a server, or a container host).

### 2.1 Start the service
```bash
# runs the service; documents stay on the machine you run it on
docxly-service
```

### 2.2 Configure the address
Set the address the service listens on:

| Setting | Default | Description |
|---|---|---|
| `DOCXLY_URLS` | `http://127.0.0.1:5000` | Address and port the service listens on. |
| `DOCXLY_MAX_UPLOAD_MB` | `10` | Maximum accepted upload size, in megabytes. |

### 2.3 Configure access (optional)
| Setting | Default | Description |
|---|---|---|
| `DOCXLY_API_KEY` | *(empty)* | When set, every request must include the key. Leave empty for an open local service. |

When `DOCXLY_API_KEY` is set, clients must send:
```
X-Api-Key: <your key>
```

### 2.4 Configuration file
Instead of environment variables, you can place a `docxly.config.json` next to
the service:

```json
{
  "urls": "http://127.0.0.1:5000",
  "maxUploadMb": 10,
  "apiKey": ""
}
```

Environment variables override the file.

---

## 3. API (for developers)

### 3.1 Health check
```
GET /health
```
```json
{ "status": "ok", "service": "docxly", "version": "1.0.0" }
```

### 3.2 Bold headings
```
POST /bold-headings
Content-Type: multipart/form-data
```

Form fields:

| Field | Required | Default | Description |
|---|---|---|---|
| `file` | Yes | - | The `.docx` file to format. |
| `include_subheadings` | No | `true` | Bold subheadings as well as headings. |
| `include_front_matter` | No | `false` | Keep this `false` to leave the setup region untouched. |

Example:
```bash
curl -X POST "https://docxly.example.com/bold-headings" \
  -H "X-Api-Key: <your key>" \
  -F "file=@document.docx" \
  -F "include_subheadings=true" \
  --output formatted.docx
```

Response: the formatted `.docx` (HTTP 200), with these headers:

| Header | Meaning |
|---|---|
| `X-Heading-Count` | Number of headings selected. |
| `X-Bolded-Paragraph-Count` | Number of paragraphs bolded. |
| `X-Changed` | `true` if the file changed, `false` if it was already correct. |

### 3.3 Errors

| Status | Body | Meaning |
|---|---|---|
| `400` | `{ "error": "..." }` | Missing file, wrong format, or file too large. |
| `401` | - | Missing or wrong API key. |

---

## 4. Security and privacy

- Documents are processed for the request and are not retained.
- Documents are not sent to third-party AI services.
- When exposed beyond your machine, always set `DOCXLY_API_KEY` and serve over
  HTTPS (via a reverse proxy).

---

## 5. Troubleshooting

| Symptom | Fix |
|---|---|
| Web app shows "cannot reach service" | Check **Service URL** and that the service is running. Click **Test connection**. |
| `401 Unauthorized` | Set the correct `X-Api-Key` in the app or request. |
| `400` on upload | Confirm the file is `.docx`, non-empty, and within the size limit. |
| Nothing changes in the output | The document already satisfied the job (`X-Changed: false`). |
| Headings not detected | The document may have very unusual structure. Report it with a sample. |

---

Note: I am not a native English speaker. This guide was written with the help of
AI tools. Improvements to the wording are welcome.
