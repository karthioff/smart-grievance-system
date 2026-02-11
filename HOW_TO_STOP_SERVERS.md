# 🛑 HOW TO STOP SERVERS MANUALLY

## 🚀 QUICK METHODS TO STOP SERVERS

### **Method 1: Simple Way (Recommended)**
If you can see the terminal windows running the servers:

**For Backend Server:**
1. Click on the backend terminal window
2. Press `Ctrl + C`
3. Server will stop immediately

**For Frontend Server:**
1. Click on the frontend terminal window  
2. Press `Ctrl + C`
3. Server will stop immediately

---

### **Method 2: Close Terminal Windows**
1. Simply close the terminal windows where servers are running
2. Both backend and frontend will stop automatically

---

### **Method 3: Task Manager (If terminals are not visible)**

**Step 1: Open Task Manager**
- Press `Ctrl + Shift + Esc`
- Or right-click taskbar → Task Manager

**Step 2: Find Node.js processes**
- Look for processes named:
  - `Node.js JavaScript Runtime`
  - `node.exe`
  - `npm.exe`

**Step 3: End the processes**
- Right-click on each Node.js process
- Click "End Task"
- Repeat for all Node.js processes

---

### **Method 4: Command Line (Advanced)**

**Step 1: Open Command Prompt as Administrator**
- Press `Win + X`
- Select "Command Prompt (Admin)" or "PowerShell (Admin)"

**Step 2: Find processes using ports**
```cmd
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

**Step 3: Kill the processes**
```cmd
taskkill /PID <PID_NUMBER> /F
```
Replace `<PID_NUMBER>` with the actual process ID from step 2.

**Example:**
```cmd
netstat -ano | findstr :5000
# Output: TCP 0.0.0.0:5000 0.0.0.0:0 LISTENING 1234

taskkill /PID 1234 /F
```

---

### **Method 5: Restart Computer (Nuclear Option)**
If nothing else works:
1. Save any important work
2. Restart your computer
3. All servers will stop automatically

---

## 🎯 STEP-BY-STEP VISUAL GUIDE

### **Stopping Backend Server:**
```
1. Look for terminal window with:
   "✓ Grievance System Backend Server Running"
   "✓ Server: http://localhost:5000"

2. Click on that window

3. Press Ctrl + C

4. You should see:
   "^C" and the server stops
```

### **Stopping Frontend Server:**
```
1. Look for terminal window with:
   "webpack compiled with warnings"
   "Local: http://localhost:3000"

2. Click on that window

3. Press Ctrl + C

4. You should see:
   "^C" and the server stops
```

---

## ⚠️ IMPORTANT NOTES

### **What happens when you stop servers:**
- ✅ Backend stops: API becomes unavailable
- ✅ Frontend stops: Website becomes inaccessible
- ✅ Database stays running: MySQL continues running
- ✅ Data is safe: No data is lost

### **You DON'T need to stop MySQL:**
- MySQL service can keep running
- It doesn't interfere with anything
- It will be ready when you restart the servers

---

## 🔍 HOW TO CHECK IF SERVERS ARE STOPPED

### **Method 1: Check in Browser**
- Go to http://localhost:3000
- If you see "This site can't be reached" → Frontend is stopped ✅
- Go to http://localhost:5000/api/health
- If you see "This site can't be reached" → Backend is stopped ✅

### **Method 2: Check Task Manager**
- Open Task Manager (`Ctrl + Shift + Esc`)
- Look for Node.js processes
- If you don't see any → Servers are stopped ✅

### **Method 3: Check Command Line**
```cmd
netstat -ano | findstr :3000
netstat -ano | findstr :5000
```
- If no output → Servers are stopped ✅

---

## 🚨 TROUBLESHOOTING

### **Problem: Ctrl+C doesn't work**
**Solution:**
1. Try pressing `Ctrl + C` multiple times
2. Or close the terminal window
3. Or use Task Manager method

### **Problem: Can't find the terminal windows**
**Solution:**
1. Check taskbar for terminal icons
2. Press `Alt + Tab` to cycle through windows
3. Use Task Manager to kill Node.js processes

### **Problem: Servers won't stop**
**Solution:**
1. Use Task Manager method
2. Kill all Node.js processes
3. Restart computer if needed

### **Problem: Port still in use after stopping**
**Solution:**
```cmd
# Kill any remaining processes on ports
netstat -ano | findstr :5000
taskkill /PID <PID> /F

netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 📋 QUICK REFERENCE

### **To Stop Servers:**
1. **Easiest**: Press `Ctrl + C` in terminal windows
2. **Simple**: Close terminal windows
3. **Advanced**: Use Task Manager
4. **Command**: Use `taskkill` commands

### **To Verify Stopped:**
1. Check http://localhost:3000 (should fail)
2. Check http://localhost:5000 (should fail)
3. Check Task Manager (no Node.js processes)

### **To Restart Later:**
1. Follow the startup guide
2. Run `npm start` in both folders
3. Servers will start fresh

---

## 🎯 COMMON SCENARIOS

### **Scenario 1: Finished with review**
```
1. Press Ctrl + C in backend terminal
2. Press Ctrl + C in frontend terminal
3. Close both terminal windows
4. Done! ✅
```

### **Scenario 2: Need to restart servers**
```
1. Stop servers (Ctrl + C)
2. Wait 5 seconds
3. Run npm start again in both folders
4. Servers restart fresh ✅
```

### **Scenario 3: Computer is slow/frozen**
```
1. Open Task Manager (Ctrl + Shift + Esc)
2. Find all Node.js processes
3. End all Node.js tasks
4. Computer should speed up ✅
```

### **Scenario 4: Going to shutdown computer**
```
1. Stop servers first (Ctrl + C)
2. Then shutdown computer
3. This prevents any issues ✅
```

---

## ✅ SUMMARY

**Easiest way to stop servers:**
1. Find the 2 terminal windows running the servers
2. Click on each window
3. Press `Ctrl + C` in each
4. Done!

**If you can't find terminals:**
1. Open Task Manager
2. End all Node.js processes
3. Done!

**The servers are stopped when:**
- http://localhost:3000 doesn't work
- http://localhost:5000 doesn't work
- No Node.js processes in Task Manager

---

*Keep this guide handy for when you need to stop the servers after your review!*