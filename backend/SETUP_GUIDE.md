# DynoForm Setup Guide

This guide will walk you through setting up the complete DynoForm backend from scratch.

## Prerequisites

Before starting, ensure you have:

1. **Node.js 18 or higher**
   ```bash
   node --version  # Should be v18.x.x or higher
   ```

2. **MongoDB**
   - Option A: Local MongoDB
     ```bash
     # Check if MongoDB is running
     mongosh --eval "db.version()"
     ```
   - Option B: MongoDB Atlas (cloud)
     - Create account at https://www.mongodb.com/cloud/atlas
     - Create a free cluster
     - Get connection string

3. **Airtable Account**
   - Sign up at https://airtable.com
   - Create an OAuth integration

---

## Step 1: Airtable OAuth Setup

### 1.1 Create OAuth Integration

1. Go to https://airtable.com/create/oauth
2. Fill in the details:
   - **App name:** DynoForm
   - **App description:** Dynamic form builder with Airtable integration
   - **Redirect URL:** `http://localhost:3000/api/auth/airtable/callback`
   - **Scopes:** 
     - `data.records:read`
     - `data.records:write`
     - `schema.bases:read`

3. Click "Register integration"

4. Copy your credentials:
   - **Client ID** (starts with `cli...`)
   - **Client Secret** (keep this secure!)

---

## Step 2: Install Dependencies

```bash
cd backend
npm install
```

This will install:
- express (web framework)
- mongoose (MongoDB ODM)
- axios (HTTP client)
- dotenv (environment variables)
- cors (CORS middleware)
- express-validator (validation)
- TypeScript and dev dependencies

---

## Step 3: Configure Environment

### 3.1 Create `.env` file

```bash
cp .env.example .env
```

### 3.2 Edit `.env` with your credentials

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
# Option A: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/dynoform

# Option B: MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dynoform?retryWrites=true&w=majority

# Airtable OAuth Configuration
AIRTABLE_CLIENT_ID=cli_your_actual_client_id_here
AIRTABLE_CLIENT_SECRET=your_actual_client_secret_here
AIRTABLE_REDIRECT_URI=http://localhost:3000/api/auth/airtable/callback

# Session Secret
SESSION_SECRET=your_random_secret_at_least_32_characters_long

# Airtable API URLs (don't change these)
AIRTABLE_API_BASE_URL=https://api.airtable.com/v0
AIRTABLE_AUTH_BASE_URL=https://airtable.com/oauth2/v1
```

**Important:** Replace the placeholders with your actual credentials!

---

## Step 4: Verify MongoDB Connection

### Option A: Local MongoDB

```bash
# Start MongoDB (if not running)
# On macOS with Homebrew:
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod

# On Windows:
# MongoDB runs as a service automatically
```

### Option B: MongoDB Atlas

1. Whitelist your IP address in Atlas
2. Create a database user
3. Update `MONGODB_URI` in `.env`

---

## Step 5: Start the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
📍 Database: dynoform

🚀 DynoForm Backend Server Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Server running on port 3000
🌍 Environment: development
🔗 API Base URL: http://localhost:3000/api
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Production Mode

```bash
npm run build
npm start
```

---

## Step 6: Test the Installation

### 6.1 Health Check

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-29T10:00:00.000Z",
  "uptime": 5.123
}
```

### 6.2 Test OAuth Flow

1. Open browser: `http://localhost:3000/api/auth/airtable`
2. You should be redirected to Airtable's authorization page
3. Click "Add bases"
4. Select which bases to grant access to
5. Click "Grant access"
6. You'll be redirected back with user information

Expected response:
```json
{
  "success": true,
  "userId": "507f1f77bcf86cd799439011",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "your.email",
    "email": "your.email@example.com",
    "role": "user"
  }
}
```

**Save the `userId` - you'll need it for authenticated requests!**

---

## Step 7: Test API Endpoints

### 7.1 List Airtable Bases

```bash
curl -H "x-user-id: YOUR_USER_ID" \
     http://localhost:3000/api/airtable/bases
```

### 7.2 List Tables in a Base

```bash
curl -H "x-user-id: YOUR_USER_ID" \
     http://localhost:3000/api/airtable/base/YOUR_BASE_ID/tables
```

### 7.3 Get Table Fields

```bash
curl -H "x-user-id: YOUR_USER_ID" \
     http://localhost:3000/api/airtable/table/YOUR_BASE_ID/YOUR_TABLE_ID/fields
```

---

## Step 8: Create Your First Form

### 8.1 Prepare the payload

Create a file `create-form.json`:

```json
{
  "airtableBaseId": "appXXXXXXXXXXXXXX",
  "airtableTableId": "tblXXXXXXXXXXXXXX",
  "questions": [
    {
      "questionKey": "name",
      "fieldId": "fldXXXXXXXXXXXXXX",
      "label": "What is your name?",
      "type": "shortText",
      "required": true
    },
    {
      "questionKey": "email",
      "fieldId": "fldYYYYYYYYYYYYYY",
      "label": "Email address",
      "type": "shortText",
      "required": true
    }
  ]
}
```

Replace the IDs with actual values from Step 7.

### 8.2 Create the form

```bash
curl -X POST \
     -H "Content-Type: application/json" \
     -H "x-user-id: YOUR_USER_ID" \
     -d @create-form.json \
     http://localhost:3000/api/forms
```

Expected response:
```json
{
  "success": true,
  "formId": "507f1f77bcf86cd799439012",
  "form": { ... }
}
```

**Save the `formId`!**

---

## Step 9: Submit a Form Response

```bash
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{
       "answers": {
         "name": "John Doe",
         "email": "john@example.com"
       }
     }' \
     http://localhost:3000/api/forms/YOUR_FORM_ID/submit
```

---

## Step 10: View Responses

```bash
curl -H "x-user-id: YOUR_USER_ID" \
     http://localhost:3000/api/forms/YOUR_FORM_ID/responses
```

---

## Step 11: Setup Airtable Webhook (Optional)

To enable real-time sync from Airtable:

### 11.1 Install ngrok (for local testing)

```bash
# Download from https://ngrok.com
# Or install via package manager
brew install ngrok  # macOS
```

### 11.2 Expose local server

```bash
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### 11.3 Register webhook with Airtable

Use the Airtable Web API to create a webhook:

```bash
curl -X POST "https://api.airtable.com/v0/bases/YOUR_BASE_ID/webhooks" \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "notificationUrl": "https://abc123.ngrok.io/api/webhooks/airtable",
       "specification": {
         "options": {
           "filters": {
             "dataTypes": ["tableData"]
           }
         }
       }
     }'
```

Now changes in Airtable will automatically sync to MongoDB!

---

## Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:** Start MongoDB service
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

---

### Airtable OAuth Error

```
error: invalid_client
```

**Solution:**
1. Check `AIRTABLE_CLIENT_ID` and `AIRTABLE_CLIENT_SECRET` in `.env`
2. Verify redirect URI matches exactly: `http://localhost:3000/api/auth/airtable/callback`
3. Ensure scopes are correct in Airtable OAuth settings

---

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
1. Kill process using port 3000:
   ```bash
   # macOS/Linux
   lsof -ti:3000 | xargs kill
   
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```
2. Or change `PORT` in `.env`

---

### TypeScript Compilation Error

```
Error: Cannot find module 'typescript'
```

**Solution:**
```bash
npm install
```

---

## Running Tests

```bash
npm test
```

This will run the test suite for conditional logic and other utilities.

---

## Next Steps

1. **Create a frontend** - Build a UI using React, Vue, or your preferred framework
2. **Implement JWT** - Replace header-based auth with JWT tokens
3. **Add more tests** - Write integration and E2E tests
4. **Deploy** - Deploy to production (Heroku, AWS, etc.)
5. **Monitor** - Add logging and monitoring

---

## Project Structure Reference

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts           # MongoDB connection
│   ├── controllers/
│   │   ├── authController.ts     # OAuth flow
│   │   ├── airtableController.ts # Airtable data
│   │   ├── formController.ts     # Form CRUD
│   │   ├── responseController.ts # Submissions
│   │   └── webhookController.ts  # Webhook handler
│   ├── middleware/
│   │   └── auth.ts               # Auth middleware
│   ├── models/
│   │   ├── User.ts               # User model
│   │   ├── FormSchema.ts         # Form model
│   │   ├── FormResponse.ts       # Response model
│   │   └── index.ts              # Exports
│   ├── routes/
│   │   └── index.ts              # All routes
│   ├── services/
│   │   └── airtableService.ts    # Airtable API wrapper
│   ├── utils/
│   │   ├── conditionalLogic.ts   # Pure function
│   │   └── fieldTypeValidation.ts
│   └── index.ts                  # Entry point
├── .env                          # Your config (not in git)
├── .env.example                  # Template
├── package.json
├── tsconfig.json
└── API_DOCUMENTATION.md          # Full API docs
```

---

## Support

For issues or questions:
1. Check the [API Documentation](API_DOCUMENTATION.md)
2. Review [Test Payloads](TEST_PAYLOADS.json)
3. Check the troubleshooting section above

---

## Security Checklist for Production

- [ ] Use strong `SESSION_SECRET`
- [ ] Enable HTTPS only
- [ ] Implement rate limiting
- [ ] Add request size limits
- [ ] Use JWT instead of header auth
- [ ] Validate all inputs
- [ ] Sanitize outputs
- [ ] Enable MongoDB authentication
- [ ] Use environment-specific configs
- [ ] Add monitoring and logging
- [ ] Regular security updates

---

**Congratulations! Your DynoForm backend is now ready! 🎉**
