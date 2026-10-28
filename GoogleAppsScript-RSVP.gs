// ============================================================
// Google Apps Script for Wedding RSVP Form
// Rohith Reji Mathew & Merin Mavelil Thomas Wedding
// ============================================================
//
// SETUP INSTRUCTIONS:
// 1. Create a new Google Sheet for storing RSVP responses
// 2. Open Extensions → Apps Script
// 3. Delete any default code and paste this entire script
// 4. Click "Deploy" → "New deployment"
// 5. Choose "Web app" as deployment type
// 6. Set the following:
//    - Description: "Wedding RSVP Handler"
//    - Execute as: "Me"
//    - Who has access: "Anyone"
// 7. Click "Deploy"
// 8. Copy the Web app URL
// 9. Paste the URL into your main.js file where it says:
//    var GOOGLE_SHEET_URL = 'YOUR_URL_HERE';
//
// ============================================================

/**
 * Handles POST requests from the RSVP form
 * This function is called automatically when data is submitted
 */
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming JSON data
    var data = JSON.parse(e.postData.contents);
    
    // Extract form fields with fallback values
    var timestamp = new Date();
    var name = data.name || '';
    var mobile = data.mobile || '';
    var email = data.email || '';
    var side = data.side || '';
    var attend = data.attend || '';
    var guests = data.guests || '1';
    
    // Create headers if this is the first entry
    if (sheet.getLastRow() === 0) {
      var headers = [
        'Timestamp',
        'Name',
        'Mobile',
        'Email',
        'Bride Side / Groom Side',
        'Will Attend',
        'Number of Guests'
      ];
      sheet.appendRow(headers);
      
      // Format header row
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#1B0E10');
      headerRange.setFontColor('#F5EFE7');
      headerRange.setHorizontalAlignment('center');
      
      // Set column widths
      sheet.setColumnWidth(1, 180); // Timestamp
      sheet.setColumnWidth(2, 200); // Name
      sheet.setColumnWidth(3, 140); // Mobile
      sheet.setColumnWidth(4, 220); // Email
      sheet.setColumnWidth(5, 140); // Side
      sheet.setColumnWidth(6, 180); // Will Attend
      sheet.setColumnWidth(7, 120); // Guests
      
      // Freeze header row
      sheet.setFrozenRows(1);
    }
    
    // Append the new RSVP data
    sheet.appendRow([
      timestamp,
      name,
      mobile,
      email,
      side,
      attend,
      guests
    ]);
    
    // Format the new row
    var lastRow = sheet.getLastRow();
    var dataRange = sheet.getRange(lastRow, 1, 1, 7);
    
    // Alternate row colors for better readability
    if (lastRow % 2 === 0) {
      dataRange.setBackground('#FAF8F5');
    }
    
    // Add borders
    dataRange.setBorder(true, true, true, true, false, false);
    
    // Center align certain columns
    sheet.getRange(lastRow, 5, 1, 1).setHorizontalAlignment('center'); // Side
    sheet.getRange(lastRow, 7, 1, 1).setHorizontalAlignment('center'); // Guests
    
    // Format timestamp
    sheet.getRange(lastRow, 1).setNumberFormat('dd/mm/yyyy hh:mm:ss');
    
    // Send confirmation email if email is provided
    if (email && email.trim() !== '') {
      sendConfirmationEmail(email, name, attend, guests);
    }
    
    // Log the submission
    Logger.log('RSVP received: ' + name + ' (' + attend + ')');
    
    // Return success response with CORS headers
    var output = ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Thank you! Your RSVP has been received.',
      'name': name
    })).setMimeType(ContentService.MimeType.JSON);
    
    return output;
    
  } catch (error) {
    // Log the error
    Logger.log('Error processing RSVP: ' + error.toString());
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': 'Sorry, there was an error processing your RSVP. Please try again.',
      'error': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handles GET requests (for testing)
 * Visit the web app URL in a browser to test if it's working
 */
function doGet(e) {
  var html = '<html><body style="font-family: Arial; padding: 40px; text-align: center;">';
  html += '<h1 style="color: #1B0E10;">Wedding RSVP Script</h1>';
  html += '<p style="color: #666;">✓ The script is running correctly!</p>';
  html += '<p style="font-size: 14px; color: #999;">This endpoint accepts POST requests from the wedding invitation form.</p>';
  html += '</body></html>';
  
  return HtmlService.createHtmlOutput(html);
}

/**
 * Sends a confirmation email to the guest
 * @param {string} email - Guest's email address
 * @param {string} name - Guest's name
 * @param {string} attend - Attendance status
 * @param {string} guests - Number of guests
 */
function sendConfirmationEmail(email, name, attend, guests) {
  try {
    var subject = 'RSVP Confirmation - Rohith & Merin Wedding';
    var htmlBody = '';
    
    // Email header
    htmlBody += '<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">';
    htmlBody += '<div style="text-align: center; border-bottom: 2px solid #C9A96E; padding-bottom: 20px; margin-bottom: 30px;">';
    htmlBody += '<h1 style="color: #1B0E10; font-size: 28px; margin: 0;">Rohith & Merin</h1>';
    htmlBody += '<p style="color: #666; font-size: 14px; margin: 10px 0 0 0;">Wedding Celebration</p>';
    htmlBody += '</div>';
    
    // Personalized greeting
    htmlBody += '<p style="color: #333; font-size: 18px; line-height: 1.6;">Dear ' + name + ',</p>';
    
    // Attendance-specific message
    if (attend === 'Yes, joyfully accepting') {
      htmlBody += '<p style="color: #333; font-size: 16px; line-height: 1.8;">';
      htmlBody += 'Thank you for confirming your attendance at our wedding! ';
      htmlBody += 'We are delighted that you will be joining us on our special day.';
      htmlBody += '</p>';
      
      if (parseInt(guests) > 1) {
        htmlBody += '<p style="color: #666; font-size: 14px;">Number of guests: ' + guests + '</p>';
      }
      
      htmlBody += '<div style="background: #FAF8F5; padding: 25px; border-left: 4px solid #C9A96E; margin: 30px 0;">';
      htmlBody += '<h2 style="color: #1B0E10; font-size: 20px; margin: 0 0 15px 0;">Wedding Details</h2>';
      htmlBody += '<p style="color: #333; margin: 8px 0;"><strong>Date:</strong> Monday, 28 December 2026</p>';
      htmlBody += '<p style="color: #333; margin: 8px 0;"><strong>Time:</strong> 11:00 AM</p>';
      htmlBody += '<p style="color: #333; margin: 8px 0;"><strong>Venue:</strong> St. Thomas Mar Thoma Church</p>';
      htmlBody += '<p style="color: #666; margin: 8px 0; font-size: 14px;">Kallooppara, Thiruvalla</p>';
      htmlBody += '<p style="color: #333; margin: 15px 0 0 0;"><strong>Reception:</strong> Church Parish Hall (Followed by Lunch)</p>';
      htmlBody += '</div>';
      
      htmlBody += '<p style="color: #666; font-size: 14px; line-height: 1.6;">';
      htmlBody += 'We look forward to celebrating with you and creating beautiful memories together.';
      htmlBody += '</p>';
      
    } else {
      htmlBody += '<p style="color: #333; font-size: 16px; line-height: 1.8;">';
      htmlBody += 'Thank you for your response. We are sorry you won\'t be able to join us on our special day. ';
      htmlBody += 'You will be missed, and we appreciate you taking the time to let us know.';
      htmlBody += '</p>';
      
      htmlBody += '<p style="color: #666; font-size: 14px; line-height: 1.6;">';
      htmlBody += 'Your thoughts and prayers mean a lot to us.';
      htmlBody += '</p>';
    }
    
    // Closing
    htmlBody += '<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E5E5;">';
    htmlBody += '<p style="color: #333; font-size: 16px; margin: 0;">With Love & Gratitude,</p>';
    htmlBody += '<p style="color: #1B0E10; font-size: 18px; font-weight: bold; margin: 10px 0;">Merin & Rohith</p>';
    htmlBody += '<p style="color: #999; font-size: 12px; margin: 20px 0 0 0; font-style: italic;">';
    htmlBody += 'Together, by the grace of God and the love of our families.';
    htmlBody += '</p>';
    htmlBody += '</div>';
    
    // Footer
    htmlBody += '<div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E5E5;">';
    htmlBody += '<p style="color: #999; font-size: 12px;">With Best Compliments: Jojy, Reny, Johana, Milan & Aaron</p>';
    htmlBody += '</div>';
    
    htmlBody += '</div>';
    
    // Plain text version
    var plainBody = 'Dear ' + name + ',\n\n';
    
    if (attend === 'Yes, joyfully accepting') {
      plainBody += 'Thank you for confirming your attendance at our wedding!\n\n';
      plainBody += 'Wedding Details:\n';
      plainBody += 'Date: Monday, 28 December 2026\n';
      plainBody += 'Time: 11:00 AM\n';
      plainBody += 'Venue: St. Thomas Mar Thoma Church, Kallooppara, Thiruvalla\n';
      plainBody += 'Reception: Church Parish Hall (Followed by Lunch)\n\n';
      plainBody += 'We look forward to celebrating with you!\n\n';
    } else {
      plainBody += 'Thank you for your response. We will miss you at our wedding.\n\n';
    }
    
    plainBody += 'With Love & Gratitude,\n';
    plainBody += 'Merin & Rohith\n\n';
    plainBody += 'With Best Compliments: Jojy, Reny, Johana, Milan & Aaron';
    
    // Send the email
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody
    });
    
    Logger.log('Confirmation email sent to: ' + email);
    
  } catch (error) {
    Logger.log('Error sending confirmation email: ' + error.toString());
    // Don't throw error - we still want the RSVP to be recorded even if email fails
  }
}

/**
 * Creates a summary sheet with statistics (optional)
 * Run this manually from the script editor to create a summary
 */
function createSummarySheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getSheets()[0];
  
  // Create or get summary sheet
  var summarySheet = ss.getSheetByName('Summary');
  if (!summarySheet) {
    summarySheet = ss.insertSheet('Summary');
  } else {
    summarySheet.clear();
  }
  
  // Get all data
  var data = dataSheet.getDataRange().getValues();
  var headers = data[0];
  
  if (data.length <= 1) {
    summarySheet.appendRow(['No RSVP data yet']);
    return;
  }
  
  // Calculate statistics
  var totalResponses = data.length - 1; // Exclude header
  var attending = 0;
  var declining = 0;
  var brideSide = 0;
  var groomSide = 0;
  var totalGuests = 0;
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var attendStatus = row[5]; // Will Attend column
    var side = row[4]; // Side column
    var guests = parseInt(row[6]) || 1; // Number of Guests column
    
    if (attendStatus && attendStatus.toString().toLowerCase().includes('yes')) {
      attending++;
      totalGuests += guests;
    } else {
      declining++;
    }
    
    if (side && side.toString().toLowerCase().includes('bride')) {
      brideSide++;
    } else {
      groomSide++;
    }
  }
  
  // Write summary
  summarySheet.appendRow(['RSVP Summary']);
  summarySheet.appendRow(['']);
  summarySheet.appendRow(['Total Responses', totalResponses]);
  summarySheet.appendRow(['Attending', attending]);
  summarySheet.appendRow(['Declining', declining]);
  summarySheet.appendRow(['']);
  summarySheet.appendRow(['Bride Side', brideSide]);
  summarySheet.appendRow(['Groom Side', groomSide]);
  summarySheet.appendRow(['']);
  summarySheet.appendRow(['Total Guests', totalGuests]);
  
  // Format summary sheet
  summarySheet.getRange('A1').setFontSize(16).setFontWeight('bold');
  summarySheet.setColumnWidth(1, 200);
  summarySheet.setColumnWidth(2, 120);
  
  Logger.log('Summary sheet created successfully');
}

/**
 * Sets up automatic email triggers (optional)
 * Run this once to enable automatic summary emails
 */
function setupTriggers() {
  // Delete existing triggers
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  
  // You can add time-based triggers here if needed
  // For example, send a daily summary email
  
  Logger.log('Triggers setup complete');
}
