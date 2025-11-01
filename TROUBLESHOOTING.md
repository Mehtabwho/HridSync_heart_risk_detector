# Troubleshooting Guide

## Where to Check Backend Logs

### 1. Backend Terminal Window
The backend logs appear in the **terminal/PowerShell window where you ran `npm run dev`** in the `backend` folder.

**To see the logs:**
1. Find the PowerShell/terminal window where you started the backend
2. You should see logs like:
   ```
   ✅ Connected to MongoDB
   🚀 Server running on port 5000
   ```
3. When you use the chat feature, you'll see additional logs like:
   ```
   2025-11-01T... - POST /api/chat
   [Chat] Processing message: i have medium heart risk...
   [OpenRouter] Making API call...
   [OpenRouter] Response status: 200
   [OpenRouter] Success - response received
   [Chat] Response generated successfully
   ```

### 2. What Each Status Code Means

#### ✅ Status 200 (Success)
```
[OpenRouter] Response status: 200
[OpenRouter] Success - response received
```
**Meaning:** API call succeeded! If chat still doesn't work, there might be an issue with response parsing.

#### ❌ Status 401 (Unauthorized)
```
[OpenRouter] Response status: 401
[OpenRouter] API Error: {"error": "Invalid API key"}
```
**Meaning:** Your OpenRouter API key is invalid or expired.
**Fix:** 
- Check your `.env` file in the `backend` folder
- Verify the `OPENROUTER_API_KEY` is correct
- Get a new API key from https://openrouter.ai

#### ⚠️ Status 429 (Too Many Requests)
```
[OpenRouter] Response status: 429
[OpenRouter] API Error: Rate limit exceeded
```
**Meaning:** You've exceeded the API rate limit or run out of credits.
**Fix:**
- Wait a few minutes and try again
- Check your OpenRouter account credits at https://openrouter.ai
- Upgrade your plan if needed

#### ❌ Network Errors
```
[OpenRouter] Fetch error: connect ECONNREFUSED
```
**Meaning:** Can't connect to OpenRouter servers.
**Fix:**
- Check your internet connection
- Check if firewall is blocking the request
- Try again after a moment

#### ❌ Other Errors
If you see any other errors, copy the full error message and check:
1. The exact error message
2. The stack trace (if shown)
3. When it occurs (during chat, assessment, etc.)

## How to Copy Logs

1. In PowerShell, right-click the terminal window
2. Select "Mark" 
3. Drag to select the log text you want to copy
4. Press Enter to copy
5. Paste it where needed (document, chat, etc.)

## Common Issues and Solutions

### Issue: Chat shows "technical difficulties" message
**Check:**
1. Backend terminal for `[OpenRouter] Response status: XXX`
2. If status is 401 → Update API key
3. If status is 429 → Check OpenRouter credits
4. If status is 200 but still fails → Check for parsing errors

### Issue: "Unable to connect to server"
**Check:**
1. Is backend running? (You should see "Server running on port 5000")
2. Is MongoDB connected? (You should see "✅ Connected to MongoDB")
3. Frontend URL matches backend? (Check `.env` file)

### Issue: No doctors showing
**Solution:**
Run: `cd backend && npm run seed`

## Getting Help

When asking for help, include:
1. The exact error message from backend terminal
2. The `[OpenRouter] Response status: XXX` line
3. Any other log lines around the error
4. What action triggered the error (chat, assessment, etc.)

