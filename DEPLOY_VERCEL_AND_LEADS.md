# MandiOS Launch Guide (Vercel + Demo Lead Capture)

## 1) Deploy to Vercel

Since your code is already on GitHub, fastest path is Git-based deployment.

1. Open the repo:
   - `https://github.com/farooqseeru/mandios-marketing-site`
2. In Vercel dashboard, click **Add New Project**.
3. Import this GitHub repo.
4. Framework preset: **Other** (static site is fine).
5. Click **Deploy**.

Vercel will auto-deploy on every push to `main`.

## 2) Capture demo requests (recommended: Google Sheet)

For early stage sales, use Google Sheet as your lead CRM.

### Why this is better than CSV files
- CSV on server is not reliable on serverless platforms.
- Sheet is live, editable, shareable, and easy to export to Excel anytime.

## 3) Connect form to your Google Sheet

The form now posts to `/api/demo-request`.
That API forwards submissions to `DEMO_WEBHOOK_URL` (if set).

### A) Create a Google Apps Script webhook

1. Open a Google Sheet for leads.
2. Extensions -> Apps Script.
3. Paste:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp || "",
    data.name || "",
    data.role || "",
    data.fudNumber || "",
    data.addressLine1 || "",
    data.addressLine2 || "",
    data.phone || "",
    data.volume || "",
    data.source || "MandiOS Demo Form"
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Deploy -> New deployment -> type **Web app**.
5. Access: **Anyone**.
6. Copy the web app URL.

### B) Add webhook URL in Vercel

In Vercel project settings:
- **Environment Variables** -> add
  - `DEMO_WEBHOOK_URL = <your_google_apps_script_web_app_url>`

Redeploy after saving.

## 4) Test

1. Open live site.
2. Submit the demo form.
3. Confirm a new row appears in your sheet.

---

## Optional next step (when lead volume grows)

Move from Google Sheet to a real CRM (HubSpot / Zoho) via Zapier or Make,
while keeping `/api/demo-request` as the stable form endpoint.
