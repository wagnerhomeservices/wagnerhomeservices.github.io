const SHEET_NAME = 'Service Requests';
const CALENDAR_ID = 'primary';

function doPost(e) {
  const p = e.parameter || {};
  const sheet = getSheet_();
  sheet.appendRow([
    new Date(), p.name || '', p.phone || '', p.email || '', p.service || '',
    p.preferredDate || '', p.preferredTime || '', p.address || '',
    p.photoLink || '', p.description || '', p.page || '', p.referrer || ''
  ]);
  if (p.preferredDate) createTentativeEvent_(p);
  return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Submitted','Name','Phone','Email','Service','Preferred Date','Preferred Time','Address','Photo Link','Description','Page','Referrer']);
  }
  return sheet;
}

function createTentativeEvent_(p) {
  const date = new Date(p.preferredDate + 'T12:00:00');
  const title = 'Tentative: ' + (p.service || 'Home service') + ' - ' + (p.name || 'Customer');
  const description = ['Phone: ' + (p.phone || ''), 'Email: ' + (p.email || ''), 'Preferred time: ' + (p.preferredTime || ''), 'Project: ' + (p.description || ''), 'Photo link: ' + (p.photoLink || '')].join('\n');
  CalendarApp.getCalendarById(CALENDAR_ID).createAllDayEvent(title, date, {description: description, location: p.address || ''});
}
