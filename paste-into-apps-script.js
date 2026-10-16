/*  Paste this whole file into Apps Script.
    Writes to: Rapid Reach Training Scores
    Select all here, copy, replace everything in the editor, save.  */

var EMAIL_TO = 'grantenyeart@gmail.com';
var SHEET_ID = '1-WyDAwOv6yEvfzevb6N8iEKXGpU8LRimDIncapeLPPc';

function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  var pass  = d.passed ? 'PASS' : 'FAIL';
  var quiz  = d.quiz  || 'Test';
  var track = d.track || '';
  var who   = d.name  || 'Someone';

  SpreadsheetApp.openById(SHEET_ID).getSheets()[0].appendRow([
    d.when || new Date(), quiz, track, who, d.score, d.total, pass, d.missed || ''
  ]);

  try {
    var color  = d.passed ? '#1a7f37' : '#b42318';
    var missed = d.missed ? d.missed.split(' ').join(', ') : 'nothing, perfect score';
    var head   = track ? quiz + '  &middot;  ' + track : quiz;
    var html =
      '<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:460px;">' +
      '<p style="font-size:12px;letter-spacing:.09em;text-transform:uppercase;' +
        'color:#667085;margin:0 0 6px;">' + head + '</p>' +
      '<h2 style="margin:0 0 2px;font-size:24px;color:#101828;">' + who + '</h2>' +
      '<p style="margin:0 0 20px;font-size:34px;font-weight:700;color:' + color + ';">' +
        d.score + ' / ' + d.total +
        ' <span style="font-size:17px;letter-spacing:.06em;">' + pass + '</span></p>' +
      '<table style="font-size:14px;color:#101828;border-collapse:collapse;">' +
      '<tr><td style="padding:5px 16px 5px 0;color:#667085;">Missed</td>' +
        '<td style="padding:5px 0;">' + missed + '</td></tr>' +
      '<tr><td style="padding:5px 16px 5px 0;color:#667085;">Submitted</td>' +
        '<td style="padding:5px 0;">' + (d.when || '') + '</td></tr>' +
      '</table></div>';

    MailApp.sendEmail({
      to: EMAIL_TO,
      subject: pass + '  ' + who + '  ' + d.score + '/' + d.total + '  ' + quiz,
      htmlBody: html
    });
  } catch (err) {
    // Score is already saved. Never lose a row because mail failed.
  }

  return ContentService.createTextOutput('ok');
}
