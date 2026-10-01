# Docxly add-in setup (Word)

**Docxly - Automated** is a Microsoft Word task pane add-in. It bolds the
headings and subheadings in the body of the open document, and leaves front
matter, body text, and lists alone.

This guide covers:

1. Where the add-in files live.
2. How to test it in your own Word (side loading).
3. How to publish it so it appears in the Word add-in library.

---

## 1. Files

The add-in lives in `addin/`:

| File | Purpose |
|---|---|
| `addin/manifest.xml` | The Word add-in manifest (name, description, icons, permissions). |
| `addin/taskpane.html` | The task pane page. |
| `addin/taskpane.js` | The add-in logic. |
| `addin/taskpane.css` | Styling. |
| `addin/assets/icon-16.png`, `icon-32.png`, `icon-80.png` | Add-in icons. |

Everything is hosted statically on GitHub Pages: `https://qazinafay.github.io/docxly/addin/`.

The manifest is a plain file. You can download it from:
`https://qazinafay.github.io/docxly/addin/manifest.xml`

---

## 2. Test it in your own Word (side load)

### Word on the web
1. Open a document at https://www.office.com/launch/word.
2. Go to **Insert** > **Add-ins** > **More Add-ins**.
3. Open the **My Add-ins** tab, then **Upload My Add-in**.
4. Choose `manifest.xml`.
5. The **Docxly - Automated** button appears under **Home** > **Add-ins**. Open it and click **Bold headings**.

### Word on Windows (desktop)
1. Open Word, then **Insert** > **Get Add-ins** > **My Add-ins**.
2. Choose **Upload My Add-in** and select `manifest.xml`.
3. Open the task pane from the **Home** tab and click **Bold headings**.

### Word on Mac
1. **Insert** > **Add-ins** > **My Add-ins** > **Upload My Add-in**.
2. Select `manifest.xml`.

Side loading is for testing. It is per user and per machine.

---

## 3. Publish so it appears in the Word add-in library

To make **Docxly - Automated** appear for everyone under **Insert** >
**Get Add-ins**, publish it to **Microsoft AppSource** through **Partner Center**.
This is the "add-ins library" route.

### 3.1 Before you submit
Prepare:
- A **Microsoft Partner Center** account (free to create; verification required).
- A **public HTTPS** hosting location for the add-in files. GitHub Pages works.
- A **privacy policy URL** (required for store listings).
- A **support URL**.
- The **manifest.xml** with store-ready name, description, icons, and support URL.

### 3.2 Submit
1. Sign in to **Partner Center**: https://partner.microsoft.com.
2. Go to **Commercial Marketplace** > **Overview** > **New offer** > **Office Add-in**.
3. Upload `manifest.xml`.
4. Fill the store listing: name, description, category (Productivity), icons, screenshots, privacy policy, support.
5. Submit for review.

### 3.3 How it looks after approval
- Users find it in **Insert** > **Get Add-ins** (AppSource), in Word desktop, web, and Mac.
- You get an AppSource listing page and a shareable link.

### 3.4 Enterprise deployment (no AppSource needed)
Admins can deploy the add-in to a whole organization from the **Microsoft 365
admin center** > **Settings** > **Integrated apps** > **Upload custom apps**,
using the same `manifest.xml`. This is the fastest way to reach a company.

### 3.5 Notes
- Office add-in submission does not require a card; it requires a verified
  Partner Center account and passing review.
- Selling *inside* the marketplace (transactable) needs extra commerce setup and
  a payout account (bank details).
- Any change to the manifest or listing goes through review again.

---

## 4. Free and paid

- **Automated (free):** bold all headings, as described above.
- **Interactive (paid, planned):** asks the user before each change.
- Free limit (planned): 3 runs per day per machine.

The per-machine limit needs a licensing layer to be enforceable. Without a
server, a local counter can be reset by the user, so treat it as a soft limit
until licensing is added.

---

Note: English is not my first language, so some wording may be imperfect.
