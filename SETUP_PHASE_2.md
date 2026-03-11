# PHASE 2 SETUP GUIDE
## Quick Setup for Remaining 50%

---

## 🚀 SETUP STEPS (5 MINUTES)

### Step 1: Create Department Officers
```bash
cd backend-node
node create-officers.js
```

**This creates 6 officers:**
- water.officer@gov.in / officer123
- electricity.officer@gov.in / officer123
- roads.officer@gov.in / officer123
- health.officer@gov.in / officer123
- sanitation.officer@gov.in / officer123
- safety.officer@gov.in / officer123

### Step 2: Start the Servers
```bash
# Double-click START_PROJECT.bat
# OR manually:
cd backend-node
node server.js

# In another terminal:
cd frontend
npm start
```

### Step 3: Test the New Features

**A. Test Auto-Assignment:**
1. Login as citizen
2. Submit complaint with category "Water Supply"
3. Login as admin
4. Check complaint - should be assigned to Water Officer

**B. Test SLA Timer:**
1. Check any complaint in admin dashboard
2. See "SLA Deadline" column
3. Overdue complaints show in RED
4. On-time complaints show in GREEN

**C. Test Notifications:**
1. Look for bell icon in dashboard (top right)
2. Click bell to see notifications
3. Submit a complaint - notification appears
4. Click notification to mark as read

**D. Test Escalation:**
1. Escalation runs automatically every 5 minutes
2. Complaints past SLA deadline get escalated
3. Status changes to "Escalated"
4. User receives notification

**E. Test Enhanced Analytics:**
1. Login as admin
2. See 10 stat cards (was 6):
   - Total Users
   - Officers
   - Total Complaints
   - Pending
   - In Progress
   - Resolved
   - Escalated
   - High Priority
   - Overdue (SLA)
   - Avg Resolution Time

---

## 🎯 WHAT'S NEW

### Backend:
- ✅ Auto-assignment to officers
- ✅ SLA deadline calculation
- ✅ Background escalation job
- ✅ Notification system
- ✅ Enhanced statistics

### Frontend:
- ✅ Notification bell component
- ✅ SLA deadline display
- ✅ 4 new stat cards
- ✅ Color-coded SLA status

### Database:
- ✅ Department field for officers
- ✅ Escalation level tracking
- ✅ Notification types
- ✅ New indexes for performance

---

## 📊 NEW ADMIN DASHBOARD FEATURES

1. **Officers Count** - See total department officers
2. **Escalated Count** - Track escalated complaints
3. **Overdue Count** - SLA breached complaints
4. **Avg Resolution** - Average time to resolve (hours)
5. **SLA Column** - See deadline for each complaint
6. **Color Coding** - Red for overdue, green for on-time

---

## 🔔 NOTIFICATION SYSTEM

**Notifications are created for:**
- Complaint submission (user)
- Complaint assignment (officer)
- Status updates (user)
- Escalations (user)

**Notification Types:**
- 🟢 Success (green)
- 🔵 Info (blue)
- 🟡 Warning (yellow)
- 🔴 Error (red)

---

## ⏰ SLA DEADLINES

**Automatic calculation based on priority:**
- 🔴 High Priority: 24 hours
- 🟡 Medium Priority: 48 hours
- 🟢 Low Priority: 72 hours

**Escalation:**
- Runs every 5 minutes
- Checks for overdue complaints
- Auto-escalates if SLA exceeded
- Max 2 escalation levels

---

## 🎓 OFFICER CREDENTIALS

All officers use same password: **officer123**

**Emails:**
- water.officer@gov.in
- electricity.officer@gov.in
- roads.officer@gov.in
- health.officer@gov.in
- sanitation.officer@gov.in
- safety.officer@gov.in

---

## 🐛 TROUBLESHOOTING

**If officers not created:**
```bash
cd backend-node
node create-officers.js
```

**If notifications not showing:**
- Check browser console for errors
- Verify token is valid
- Refresh the page

**If escalation not working:**
- Wait 5 minutes (background job interval)
- Check server console for errors
- Verify SLA deadline is in the past

**If auto-assignment not working:**
- Verify officers exist in database
- Check officer departments match categories
- Check server console for errors

---

## ✅ VERIFICATION CHECKLIST

- [ ] Officers created successfully
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 3000)
- [ ] Can submit complaint
- [ ] Complaint auto-assigned to officer
- [ ] SLA deadline calculated
- [ ] Notification bell shows count
- [ ] Can view notifications
- [ ] Admin dashboard shows 10 stats
- [ ] SLA column visible in admin table
- [ ] Overdue complaints show in red

---

## 🎉 YOU'RE DONE!

The system is now **100% complete** with all features working!

**Test everything before your deadline tonight!**

Good luck! 🚀
