# WACSA-MD Electron Error Fix Documentation

## Problem Summary

WACSA-MD Electron application fails to start with error:
```
TypeError: Cannot read property 'whenReady' of undefined
```

## Root Cause Analysis

### 1. Environment Variable Issue
**Problem:** `ELECTRON_RUN_AS_NODE=1` environment variable causes Electron to run in Node.js mode instead of Electron mode.

**Symptoms:**
- `require("electron")` returns string (path to executable) instead of module object
- `app`, `BrowserWindow`, `ipcMain`, `dialog` are all `undefined`
- Electron modules not injected into global scope

**Detection:**
```bash
Get-ChildItem Env: | Where-Object {$_.Name -like "*ELECTRON*"}
# Output: ELECTRON_RUN_AS_NODE = 1
```

### 2. Module Import Issue
**Problem:** Electron v12 uses different module loading mechanism compared to newer versions.

**Symptoms:**
- Destructuring import `const { app } = require("electron")` fails
- Direct require returns path string instead of object

## Solutions

### Solution 1: Clear Environment Variable (Recommended)

**Step 1: Remove Environment Variable**
```powershell
# Remove from current session
Remove-Item Env:ELECTRON_RUN_AS_NODE -Force

# Remove permanently (run as Administrator)
[System.Environment]::SetEnvironmentVariable('ELECTRON_RUN_AS_NODE', $null, 'User')
[System.Environment]::SetEnvironmentVariable('ELECTRON_RUN_AS_NODE', $null, 'Machine')
```

**Step 2: Close and Reopen Terminal**
```bash
# Open new terminal session
cd d:\deden\projects\wacsa-md
npm start
```

### Solution 2: Use Different Terminal/Computer

**Option A: New Terminal Session**
- Close current terminal completely
- Open new terminal (PowerShell/CMD)
- Run `npm start`

**Option B: Different Computer**
- Copy project to computer without `ELECTRON_RUN_AS_NODE` issue
- Install dependencies and run normally

### Solution 3: Bypass Environment Variable

**Step 1: Use CMD without Environment Variable**
```bash
cmd /c "set ELECTRON_RUN_AS_NODE= && npm start"
```

**Step 2: Use PowerShell with Cleared Environment**
```powershell
$env:ELECTRON_RUN_AS_NODE = $null
npm start
```

## Authentication Issues

### Problem: Login "Email atau Password Tidak Cocok"

**Root Cause:** `make-credentials.js` overwrites credentials.json with empty environment variables.

**Solution:**

**Step 1: Set Environment Variables**
```bash
$env:ACCESS_TOKEN = "46a3c0ac2e80d24b1a51a07ae6cfd8d3"
$env:ACCESS_ID = "wa@csacomputer.com"
$env:ACCESS_PWD = "completeselular2024"
$env:USE_WWEB_CACHE = "FALSE"
$env:WWEB_CACHE_VER = "2.2410.1"
$env:UPDATER_URL = "http://localhost/wacsa-updater"
```

**Step 2: Update make-credentials.js**
```javascript
// Check if credentials already exist before overwriting
try {
  const existing = await fs.readFile("./src/credentials.json", "utf8");
  const parsed = JSON.parse(existing);
  if (parsed.id && parsed.password) {
    console.log("Credentials already exist, skipping generation");
    process.exit(0);
  }
} catch (e) {
  // Continue with generation
}
```

**Step 3: Use Environment Files**
```bash
# Use complete environment
npm run dev:complete

# Or manual load
npx env-cmd -f .env.complete npm start
```

## Alternative Solutions

### Solution 4: Upgrade Electron Version

**Risk:** May break compatibility with whatsapp-web.js v1.34.6

**Steps:**
```bash
npm install electron@20.3.1 --save-dev
npm install custom-electron-titlebar@4.2.8 --save-dev
npm install whatsapp-web.js@1.22.0 --save
```

### Solution 5: Use Docker Environment

**Create Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV ELECTRON_RUN_AS_NODE=""
CMD ["npm", "start"]
```

## Verification Steps

### 1. Check Environment
```bash
# Should return empty
$env:ELECTRON_RUN_AS_NODE

# Should show electron modules
node -e "console.log(require('electron'))"
```

### 2. Test Login
```bash
# Test API directly
$body = @{email="wa@csacomputer.com"; password="completeselular2024"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:8008/auth/login" -Method Post -Body $body -ContentType "application/json"
```

### 3. Check Credentials
```bash
Get-Content src/credentials.json | ConvertFrom-Json
```

## Files Modified

1. `src/app.js` - Added debug logging for electron modules
2. `src/main/routes/auth.routes.js` - Added debug logging for authentication
3. `src/main/system/index.js` - Removed electron app dependency
4. `src/main/whatsapp/index.js` - Removed system module dependency
5. `make-credentials.js` - Added check for existing credentials
6. `package.json` - Added dev:complete script

## Environment Files Reference

| File | Email | Password | Token | Usage |
|------|-------|----------|-------|-------|
| `.env.complete` | `wa@csacomputer.com` | `completeselular2024` | `46a3c0ac2e80d24b1a51a07ae6cfd8d3` | Complete client |
| `.env.bless` | `wa@csacomputer.com` | `bless2025` | `66c6a5f4b78101deef972cd153759a48` | Bless client |
| `.env.origin` | `wa@csacomputer.com` | `csa2025` | `3b5d1d11b28204e322b60622d8805681` | Original/template |

## Prevention

1. **Never set ELECTRON_RUN_AS_NODE=1** permanently
2. **Use environment files** instead of manual environment variables
3. **Check credentials.json** before running make-credentials.js
4. **Use new terminal session** when encountering electron issues

## Support

If issue persists:
1. Check system environment variables
2. Try on different computer
3. Contact CSA Computer support
4. Check Node.js version compatibility (v14 for Electron v12)

---

**Last Updated:** 2026-03-26  
**Issue:** Electron startup failure due to environment variable conflict  
**Status:** Solution documented, awaiting implementation
