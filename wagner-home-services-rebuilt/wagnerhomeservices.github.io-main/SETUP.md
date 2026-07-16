# Wagner Home Services website setup

## 1. Publish the website
Upload all files in this folder to the root of the `wagnerhomeservices.github.io` repository. Keep `CNAME` unchanged so `whomeservices.net` remains connected.

## 2. Activate Google Sheets + Calendar forms
The spreadsheet is already created:
`https://docs.google.com/spreadsheets/d/1vC2gf4Pm_lpl_I_-4seeahKKu5ddMBp1nizyBiwulIo/edit`

1. Open the spreadsheet.
2. Select **Extensions → Apps Script**.
3. Delete the sample code and paste the entire contents of `google-apps-script.gs`.
4. In Apps Script, select **Project Settings** and set the time zone to **America/Denver**.
5. Select **Deploy → New deployment → Web app**.
6. Execute as **Me** and set access to **Anyone**.
7. Authorize Sheets, Calendar, and Gmail when Google asks.
8. Copy the deployment URL ending in `/exec`.
9. Open `script.js` and replace `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL` with that URL.
10. Upload the updated `script.js` to GitHub.

The backend will save rack orders to **Orders**, save service requests to **Service Leads**, create tentative service events in **WHS Service Appointments**, and email both the business and customer.

## 3. Google Analytics
The website currently uses the existing measurement ID `G-WEZ9VVS4D8` found in the old site. Confirm this ID belongs to your Google Analytics property. If not, replace it in `script.js`.

## 4. Square payments
The site intentionally does not collect card information. Review each order, then send a Square invoice for the 50% deposit. The remaining balance is due at pickup or delivery.

## 5. Google reviews and project photos
Current review screenshots and selected project photos are stored in the repository for reliable loading. Replace or add images in `image/projects/` as real rack installations are completed.
