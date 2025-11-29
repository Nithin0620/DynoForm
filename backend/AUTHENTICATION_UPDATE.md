# Authentication & Authorization Update

## 🔄 Changes Made

### 1. **Removed Admin Role**
- ❌ Removed `role` field from User model
- All users now have equal privileges
- Any authenticated user can:
  - Create forms
  - Submit responses to any form
  - View and manage their own forms
  - View responses to forms they created

### 2. **Implemented JWT Authentication**
- ✅ Added `jsonwebtoken` package
- ✅ JWT tokens generated on OAuth callback
- ✅ Tokens valid for 7 days
- ✅ No need to re-login if token is still valid

### 3. **Updated Authorization Logic**
- ✅ Form access: Only form owner can view/edit
- ✅ Response access: Only form owner can view responses
- ✅ Form submission: Anyone can submit to any form (public)

---

## 🔑 How Authentication Works Now

### OAuth Flow

1. **User initiates OAuth**
   ```
   GET /api/auth/airtable
   ```

2. **Callback returns JWT token**
   ```json
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": "507f1f77bcf86cd799439011",
       "name": "john.doe",
       "email": "john.doe@example.com"
     }
   }
   ```

3. **Store token in frontend** (localStorage/sessionStorage)

4. **Use token in subsequent requests**
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Token Expiry
- Tokens are valid for **7 days**
- After 7 days, user needs to re-authenticate
- Frontend should handle 401 responses and redirect to login

---

## 📝 API Changes

### Before (Old)
```bash
# Used x-user-id header
curl -H "x-user-id: 507f1f77bcf86cd799439011" \
     http://localhost:3000/api/forms
```

### After (New)
```bash
# Use Authorization Bearer token
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     http://localhost:3000/api/forms
```

---

## 🔒 Authorization Rules

### Who Can Do What

| Action | Who Can Do It |
|--------|---------------|
| Create form | Any authenticated user |
| View form | Only form owner |
| Edit form | Only form owner |
| Delete form | Only form owner |
| Submit response | **Anyone (public - no auth needed)** |
| View responses | Only form owner |
| List forms | Each user sees only their own forms |

### Example Scenarios

**Scenario 1: User A creates a form**
- ✅ User A can view/edit the form
- ✅ User A can see responses
- ❌ User B cannot view the form
- ❌ User B cannot see responses
- ✅ Anyone (A, B, C...) can submit responses

**Scenario 2: Public form submission**
- No authentication required for `/api/forms/:formId/submit`
- Anyone with the form ID can submit
- Great for public surveys, contact forms, etc.

**Scenario 3: Token expiry**
- Day 1-7: User stays logged in (token valid)
- Day 8+: Token expires, user must re-authenticate
- Frontend should catch 401 and redirect to login

---

## 🛠️ Environment Variables

Add to your `.env` file:

```env
# JWT Secret (use a strong random string!)
JWT_SECRET=your_super_secret_jwt_key_at_least_32_chars_long
```

Generate a secure secret:
```bash
# On Linux/Mac
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🔧 Frontend Integration

### Save Token After Login

```javascript
// After OAuth callback
const response = await fetch('/api/auth/airtable/callback?code=...');
const data = await response.json();

// Save token
localStorage.setItem('authToken', data.token);
localStorage.setItem('user', JSON.stringify(data.user));
```

### Use Token in Requests

```javascript
// Add to all authenticated requests
const token = localStorage.getItem('authToken');

fetch('/api/forms', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Handle Token Expiry

```javascript
// Axios interceptor example
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Check if User is Logged In

```javascript
function isAuthenticated() {
  const token = localStorage.getItem('authToken');
  if (!token) return false;
  
  // Optionally decode and check expiry
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
```

---

## 🧪 Testing the Changes

### 1. Test OAuth & JWT
```bash
# 1. Initiate OAuth (opens browser)
open http://localhost:3000/api/auth/airtable

# 2. After callback, you'll get:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {...}
}

# 3. Copy the token and use it
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 2. Test Authenticated Endpoints
```bash
# Create a form
curl -X POST http://localhost:3000/api/forms \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "airtableBaseId": "appXXX",
    "airtableTableId": "tblXXX",
    "questions": [...]
  }'

# List your forms
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:3000/api/forms

# Get specific form (you must be owner)
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:3000/api/form/FORM_ID
```

### 3. Test Public Submission (No Auth)
```bash
# Submit a form response (NO TOKEN NEEDED)
curl -X POST http://localhost:3000/api/forms/FORM_ID/submit \
  -H "Content-Type: application/json" \
  -d '{
    "answers": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }'
```

### 4. Test Ownership
```bash
# User A creates form
export TOKEN_A="..."
curl -X POST http://localhost:3000/api/forms \
  -H "Authorization: Bearer $TOKEN_A" \
  -d '...'

# User B tries to access User A's form (should fail with 403)
export TOKEN_B="..."
curl -H "Authorization: Bearer $TOKEN_B" \
     http://localhost:3000/api/form/USER_A_FORM_ID

# Response:
{
  "error": "Access denied. You can only access forms you created."
}
```

---

## 🔐 Security Considerations

### ✅ Implemented
- JWT tokens with expiration (7 days)
- Token verification on each request
- Ownership validation (user can only access own forms)
- Public form submission (good for surveys)

### 💡 Recommendations for Production

1. **Use HTTPS only**
   ```javascript
   app.use((req, res, next) => {
     if (!req.secure) {
       return res.redirect('https://' + req.headers.host + req.url);
     }
     next();
   });
   ```

2. **Add refresh tokens**
   - Store long-lived refresh token
   - Issue short-lived access tokens (1 hour)
   - Refresh access token before expiry

3. **Rate limiting**
   ```bash
   npm install express-rate-limit
   ```

4. **CORS configuration**
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true
   }));
   ```

5. **Store JWT_SECRET securely**
   - Use environment variables
   - Never commit to git
   - Use secrets manager in production (AWS Secrets Manager, etc.)

---

## 📊 Database Schema Changes

### User Model (Before)
```typescript
{
  _id: ObjectId,
  airtableUserId: string,
  name: string,
  email: string,
  accessToken: string,
  refreshToken: string,
  loginTimestamp: Date,
  role: 'user' | 'admin'  // ❌ REMOVED
}
```

### User Model (After)
```typescript
{
  _id: ObjectId,
  airtableUserId: string,
  name: string,
  email: string,
  accessToken: string,
  refreshToken: string,
  loginTimestamp: Date
  // ✅ No role field
}
```

**No migration needed!** Existing users will just have `role` field ignored.

---

## 🎯 Summary

### What Changed
- ❌ Removed admin role entirely
- ✅ Added JWT token authentication
- ✅ Tokens valid for 7 days (no re-login needed)
- ✅ Form ownership validation (not admin checks)
- ✅ Public form submission (anyone can submit)

### Authentication Flow
1. User authenticates via Airtable OAuth
2. Backend generates JWT token (valid 7 days)
3. Frontend stores token
4. All authenticated requests use: `Authorization: Bearer <token>`
5. Token auto-expires after 7 days

### Authorization Rules
- ✅ Any user can create forms
- ✅ Only form owner can view/edit their forms
- ✅ Only form owner can see responses
- ✅ Anyone can submit responses (public)

---

**The system is now more secure, user-friendly, and ready for production use!** 🚀
