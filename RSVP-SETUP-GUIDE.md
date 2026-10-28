# Wedding RSVP Setup Guide
## Rohith Reji Mathew & Merin Mavelil Thomas

This guide will help you set up the Google Sheets RSVP system for your wedding website.

---

## 📋 What You'll Need
- A Google Account
- Access to Google Sheets
- The wedding website code (already set up)
- 10-15 minutes

---

## 🚀 Step-by-Step Setup

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"Blank"** to create a new spreadsheet
3. Name it: **"Rohith & Merin Wedding RSVP"**
4. Leave the sheet empty - the script will create headers automatically

### Step 2: Open Apps Script Editor

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. You'll see a code editor with a default `myFunction()` code
3. **Delete all the default code** in the editor

### Step 3: Add the RSVP Script

1. Open the file `GoogleAppsScript-RSVP.gs` (in this project folder)
2. Copy **all the code** from that file
3. Paste it into the Apps Script editor
4. Click the **Save** icon (💾) or press `Ctrl+S`
5. Name your project: **"Wedding RSVP Handler"**

### Step 4: Deploy as Web App

1. In the Apps Script editor, click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **"Web app"**
4. Configure the deployment:
   - **Description:** "Wedding RSVP Form Handler"
   - **Execute as:** Me (your email)
   - **Who has access:** **Anyone** ← This is important!
5. Click **Deploy**
6. You may need to authorize the script:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** → **Go to [Project Name] (unsafe)**
   - Click **Allow**
7. **Copy the Web app URL** (it looks like: `https://script.google.com/macros/s/...../exec`)

### Step 5: Update Your Website

1. Open the file `js/main.js` in your website code
2. Find this line (around line 537):
   ```javascript
   var GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyFPqYjHB09WYccSFWrtPGTC29ICirvgoR3fG8L3cEY46jHjNKArIiYtjxON7800970/exec';
   ```
3. **Replace** the URL with your new Web app URL from Step 4
4. Save the file

### Step 6: Test Your RSVP Form

1. Deploy your website (push to GitHub, Vercel, etc.)
2. Open your wedding website
3. Scroll to the RSVP section
4. Fill out the form with test data
5. Click **"Send RSVP"**
6. Check your Google Sheet - you should see the test entry!

---

## ✅ What Happens When Someone RSVPs

1. **Form submission** → Guest fills out the RSVP form on your website
2. **Data sent** → Form data is sent to your Google Apps Script
3. **Sheet updated** → New row is added to your Google Sheet with:
   - Timestamp
   - Name
   - Mobile number
   - Email (optional)
   - Bride Side / Groom Side
   - Attendance status
   - Number of guests
4. **Email sent** → Guest receives a confirmation email (if they provided an email)
5. **Success message** → Button changes to "Thank You!"

---

## 📊 Data Collected

Your Google Sheet will have these columns:

| Column | Description |
|--------|-------------|
| Timestamp | Date and time of RSVP submission |
| Name | Guest's full name |
| Mobile | Guest's mobile number |
| Email | Guest's email address (optional) |
| Bride Side / Groom Side | Which side of the family |
| Will Attend | "Yes, joyfully accepting" or "Regretfully declining" |
| Number of Guests | How many people are attending |

---

## 📧 Email Confirmation

The script automatically sends a beautifully formatted confirmation email to guests who provide their email address.

**Features:**
- Personalized greeting with guest name
- Different messages for attending vs. declining
- Wedding details (date, time, venue)
- Reception information
- Professional styling with your wedding colors

---

## 🔧 Advanced Features

### Create a Summary Sheet

To get statistics about your RSVPs:

1. In Apps Script editor, find the `createSummarySheet()` function
2. Click **Run** → Select `createSummarySheet`
3. A new "Summary" tab will be created with:
   - Total responses
   - Number attending vs. declining
   - Bride side vs. Groom side count
   - Total guest count

### Customize the Email

To modify the confirmation email:

1. Find the `sendConfirmationEmail()` function in the script
2. Edit the `htmlBody` variable to change the email content
3. Save and deploy again

---

## 🛠️ Troubleshooting

### "Script not found" error
- Make sure you deployed the script as a **Web app**
- Check that "Who has access" is set to **"Anyone"**
- Make sure you copied the **entire URL** including `/exec` at the end

### RSVPs not appearing in sheet
- Check if the sheet has the correct permissions
- Try running `doGet()` function to test if script is working
- Check Apps Script logs: **View** → **Logs**

### Email not sending
- Check if Gmail API is enabled for your account
- Verify email addresses are valid
- Check Apps Script logs for errors

### Form shows error message
- Open browser console (F12) to see the actual error
- Check if GOOGLE_SHEET_URL is correct in main.js
- Verify the script is deployed and accessible

---

## 🔐 Security & Privacy

- The script runs under **your Google account**
- Only you can access the Google Sheet
- Guest data is stored securely in Google Sheets
- The web app URL is public, but it only accepts POST requests
- No sensitive data is exposed to the website visitors

---

## 📱 Testing Checklist

Before going live, test these scenarios:

- [ ] Submit RSVP with all fields filled (attending)
- [ ] Submit RSVP declining attendance
- [ ] Submit without email (optional field)
- [ ] Check if data appears in Google Sheet correctly
- [ ] Verify email confirmation is received
- [ ] Test on mobile device
- [ ] Test on different browsers

---

## 💡 Tips

1. **Back up your sheet regularly** - Download as Excel or make a copy
2. **Check spam folder** - Confirmation emails might end up there
3. **Monitor responses** - Check your sheet periodically
4. **Test before announcing** - Send test RSVPs before sharing the website
5. **Keep the URL private** - Only share the wedding website URL, not the sheet URL

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Apps Script execution logs
3. Test the script with sample data
4. Verify all URLs are correct

---

## 🎉 You're All Set!

Once deployed, your RSVP system will:
- ✅ Collect guest responses automatically
- ✅ Send beautiful confirmation emails
- ✅ Store all data securely in Google Sheets
- ✅ Work seamlessly with your wedding website

**May your wedding preparations be blessed with joy and your celebration filled with love!**

---

*With Best Compliments: Jojy, Reny, Johana, Milan & Aaron*
