# NOTIFICATION SETUP GUIDE
## Email & SMS Integration for Admin Alerts

---

## 🎯 WHAT'S NEW

When a user submits a complaint, the admin will receive:
1. **📧 Email Notification** to karthimurthy2406@gmail.com
2. **📱 SMS Notification** to +91 9566780485
3. **🔔 In-App Notification** in Admin Dashboard

---

## 📧 EMAIL SETUP (Gmail)

### Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification"

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Click "Generate"
4. Copy the 16-character password

### Step 3: Update .env File
Open `backend-node/.env` and update:

```env
EMAIL_USER=karthimurthy2406@gmail.com
EMAIL_PASSWORD=your-16-character-app-password-here
```

Replace `your-16-character-app-password-here` with the password from Step 2.

---

## 📱 SMS SETUP (Twilio)

### Step 1: Create Twilio Account
1. Go to https://www.twilio.com/try-twilio
2. Sign up for free account
3. Verify your phone number (+91 9566780485)

### Step 2: Get Credentials
1. Go to Twilio Console: https://console.twilio.com/
2. Copy your:
   - Account SID
   - Auth Token
3. Get a Twilio phone number (free trial includes one)

### Step 3: Update .env File
Open `backend-node/.env` and update:

```env
TWILIO_ACCOUNT_SID=your-account-sid-here
TWILIO_AUTH_TOKEN=your-auth-token-here
TWILIO_PHONE_NUMBER=your-twilio-number-here
```

**Note:** Twilio free trial allows SMS to verified numbers only.

---

## 🚀 QUICK START (Email Only)

If you want to test email notifications immediately:

1. **Update .env with Gmail App Password:**
```env
EMAIL_USER=karthimurthy2406@gmail.com
EMAIL_PASSWORD=your-app-password
```

2. **Restart Backend Server:**
```bash
# Stop current server (Ctrl+C)
cd backend-node
node server.js
```

3. **Test:**
- Submit a complaint as user
- Check email: karthimurthy2406@gmail.com
- You'll receive a beautiful HTML email with complaint details!

---

## 📋 CURRENT .ENV CONFIGURATION

Your `.env` file should look like this:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root123
DB_NAME=grievance_system
JWT_SECRET_KEY=grievance-system-secret-key-2024
PORT=5000

# Admin Notification Settings
ADMIN_PHONE=9566780485
ADMIN_EMAIL=karthimurthy2406@gmail.com

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=karthimurthy2406@gmail.com
EMAIL_PASSWORD=your-app-password-here

# Twilio SMS Configuration (Optional)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
```

---

## ✅ WHAT WORKS NOW (Without Setup)

Even without email/SMS credentials:
- ✅ In-app notifications work perfectly
- ✅ Admin gets notification bell alerts
- ✅ System logs show notification attempts
- ⚠️ Email/SMS will show warning but won't break the app

---

## 📧 EMAIL NOTIFICATION FEATURES

When complaint is submitted, admin receives email with:
- 🎨 Beautiful HTML design with gradient header
- 📊 Complete complaint details table
- 🎯 Priority badge (color-coded)
- 👤 User information (name, email, phone)
- 📝 Full complaint description
- 🔗 Direct link to admin dashboard
- 📱 Mobile-responsive design

---

## 📱 SMS NOTIFICATION FEATURES

Admin receives SMS with:
- 🚨 Priority level
- 🆔 Complaint ID
- 📝 Title and category
- 👤 User name
- 🔗 Quick link to dashboard

Example SMS:
```
🚨 New High Priority Complaint #123
Title: Water leakage in main road
Category: Water Supply
From: John Doe
View: http://localhost:3000/admin
```

---

## 🔔 IN-APP NOTIFICATION (Already Working!)

Admin dashboard now has:
- Bell icon in top-right corner
- Red badge with unread count
- Dropdown with all notifications
- Auto-refresh every 30 seconds
- Click to mark as read

---

## 🧪 TESTING

### Test Email (After Setup):
1. Update .env with Gmail app password
2. Restart backend server
3. Login as user
4. Submit a complaint
5. Check email: karthimurthy2406@gmail.com
6. You should receive HTML email!

### Test SMS (After Twilio Setup):
1. Update .env with Twilio credentials
2. Restart backend server
3. Submit a complaint
4. Check phone: +91 9566780485
5. You should receive SMS!

### Test In-App (Works Now!):
1. Login as admin
2. Look at top-right corner - bell icon
3. Submit complaint as user
4. Admin bell shows red badge
5. Click bell to see notification

---

## 🐛 TROUBLESHOOTING

### Email Not Sending:
- ✅ Check Gmail app password is correct
- ✅ Ensure 2FA is enabled on Gmail
- ✅ Check server console for error messages
- ✅ Verify EMAIL_USER and EMAIL_PASSWORD in .env

### SMS Not Sending:
- ✅ Verify phone number in Twilio console
- ✅ Check Twilio credentials are correct
- ✅ Ensure phone number is verified (free trial)
- ✅ Check Twilio account balance

### In-App Not Showing:
- ✅ Clear browser cache
- ✅ Refresh page
- ✅ Check browser console for errors
- ✅ Verify backend server is running

---

## 💰 COST INFORMATION

### Email (Gmail):
- ✅ **FREE** - No cost for sending emails

### SMS (Twilio):
- 🆓 **Free Trial:** $15 credit
- 💵 **After Trial:** ~$0.0075 per SMS to India
- 📱 **Phone Number:** $1/month (after trial)

---

## 🎯 PRIORITY SETUP

**For Tonight's Demo:**
1. ✅ In-app notifications (Already working!)
2. 📧 Email setup (5 minutes - Recommended)
3. 📱 SMS setup (Optional - Can do later)

**Recommendation:** Set up email first, it's quick and free!

---

## 📞 SUPPORT

If you need help:
- Check server console for error messages
- Verify .env file has correct credentials
- Ensure backend server is restarted after .env changes

---

## 🎉 SUMMARY

**What's Implemented:**
- ✅ Email notification system (needs Gmail app password)
- ✅ SMS notification system (needs Twilio account)
- ✅ In-app notification system (working now!)
- ✅ Beautiful HTML email template
- ✅ Admin notification bell in dashboard
- ✅ Automatic notifications on complaint submission

**Next Steps:**
1. Get Gmail app password (5 minutes)
2. Update .env file
3. Restart server
4. Test by submitting complaint
5. Check email!

**Good luck with your demo tonight!** 🚀

