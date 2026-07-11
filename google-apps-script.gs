/**
 * Wagner Home Services website backend.
 * 1. Open the Google Sheet listed below.
 * 2. Extensions > Apps Script.
 * 3. Replace the editor contents with this file.
 * 4. Deploy > New deployment > Web app.
 *    Execute as: Me. Who has access: Anyone.
 * 5. Paste the /exec URL into APP_CONFIG.appsScriptUrl in script.js.
 */
const SPREADSHEET_ID = '1vC2gf4Pm_lpl_I_-4seeahKKu5ddMBp1nizyBiwulIo';
const OWNER_EMAIL = 'jwagner@whomeservices.net';
const SERVICE_CALENDAR_NAME = 'WHS Service Appointments';
const RACK_CALENDAR_NAME = 'WHS Rack Production and Delivery';

function doPost(e) {
  try {
    const p = e.parameter || {};
    if (p.website) return output({ok:true});
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    if (p.formType === 'order') handleOrder_(ss, p);
    else if (p.formType === 'service') handleService_(ss, p);
    else throw new Error('Unknown form type');
    return output({ok:true});
  } catch (err) {
    console.error(err);
    return output({ok:false,error:String(err)});
  }
}

function handleOrder_(ss, p) {
  const sheet = ss.getSheetByName('Orders');
  const id = 'WHS-R-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
  sheet.appendRow([id,new Date(),p.name,p.phone,p.email,p.product,p.quantity,p.casters,p.toteOption,p.toteQuantity,p.finish,p.fulfillment,p.address,p.notes,'New','Deposit pending',p.referrer||'Direct']);
  MailApp.sendEmail({to:OWNER_EMAIL,subject:`New rack order request: ${p.product}`,htmlBody:buildEmail_('Rack order request',p)});
  if (p.email) MailApp.sendEmail({to:p.email,subject:'Wagner Home Services received your rack request',htmlBody:'<p>We received your request and will review the rack configuration, delivery and pricing. After confirmation, we will send a Square invoice for the 50% deposit.</p>'});
}

function handleService_(ss, p) {
  const sheet = ss.getSheetByName('Service Leads');
  const id = 'WHS-S-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
  let eventId = '';
  if (p.preferredDate) {
    const calendar = getOrCreateCalendar_(SERVICE_CALENDAR_NAME);
    const start = new Date(p.preferredDate + 'T09:00:00');
    const end = new Date(start.getTime() + 60*60*1000);
    const event = calendar.createEvent(`TENTATIVE: ${p.service} — ${p.name}`,start,end,{location:p.address||'',description:`Phone: ${p.phone}\nEmail: ${p.email}\nPreferred window: ${p.preferredTime}\nDescription: ${p.description}\nPhoto link: ${p.photoLink||''}`});
    eventId = event.getId();
  }
  sheet.appendRow([id,new Date(),p.name,p.phone,p.email,p.service,p.preferredDate,p.preferredTime,p.address,p.description,p.photoLink,'New',p.referrer||'Direct',eventId]);
  MailApp.sendEmail({to:OWNER_EMAIL,subject:`New service request: ${p.service}`,htmlBody:buildEmail_('Service request',p)});
  if (p.email) MailApp.sendEmail({to:p.email,subject:'Wagner Home Services received your service request',htmlBody:'<p>We received your requested date and service details. The appointment is not confirmed until we contact you.</p>'});
}

function getOrCreateCalendar_(name) {
  const calendars = CalendarApp.getCalendarsByName(name);
  return calendars.length ? calendars[0] : CalendarApp.createCalendar(name);
}

function buildEmail_(title,p){return `<h2>${title}</h2><pre style="font-family:Arial;white-space:pre-wrap">${Object.keys(p).map(k=>`${k}: ${p[k]}`).join('\n')}</pre>`}
function output(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)}
