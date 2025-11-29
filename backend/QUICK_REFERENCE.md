# DynoForm Quick Reference

## Essential Commands

```bash
# Development
npm run dev              # Start dev server with auto-reload

# Production
npm run build            # Compile TypeScript
npm start                # Run compiled code

# Testing
npm test                 # Run tests
```

---

## Authentication Flow

1. **Initiate OAuth:**
   ```
   GET /api/auth/airtable
   ```
   → Redirects to Airtable

2. **Handle Callback:**
   ```
   GET /api/auth/airtable/callback?code=xxx
   ```
   → Returns userId

3. **Use userId in headers:**
   ```
   x-user-id: <userId>
   ```

---

## Common Workflows

### Workflow 1: Create and Submit a Form

```bash
# 1. Authenticate (opens browser)
open http://localhost:3000/api/auth/airtable

# 2. Get bases
curl -H "x-user-id: <userId>" \
     http://localhost:3000/api/airtable/bases

# 3. Get tables
curl -H "x-user-id: <userId>" \
     http://localhost:3000/api/airtable/base/<baseId>/tables

# 4. Get fields
curl -H "x-user-id: <userId>" \
     http://localhost:3000/api/airtable/table/<baseId>/<tableId>/fields

# 5. Create form
curl -X POST \
     -H "Content-Type: application/json" \
     -H "x-user-id: <userId>" \
     -d @form-payload.json \
     http://localhost:3000/api/forms

# 6. Submit response
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"answers": {"key": "value"}}' \
     http://localhost:3000/api/forms/<formId>/submit

# 7. View responses
curl -H "x-user-id: <userId>" \
     http://localhost:3000/api/forms/<formId>/responses
```

---

## Field Type Mappings

| Airtable          | Internal      | Validation                |
|-------------------|---------------|---------------------------|
| singleLineText    | shortText     | string                    |
| multilineText     | longText      | string                    |
| singleSelect      | singleSelect  | string (must be in options)|
| multipleSelects   | multiSelect   | array (all in options)    |
| multipleAttachments| attachment   | array of {url, filename}  |

---

## Conditional Logic Quick Reference

### Structure
```json
{
  "conditionalRules": {
    "logic": "AND" | "OR",
    "conditions": [
      {
        "questionKey": "previousQuestion",
        "operator": "equals" | "notEquals" | "contains",
        "value": "expectedValue"
      }
    ]
  }
}
```

### Examples

**Show only if status is "Active":**
```json
{
  "logic": "AND",
  "conditions": [
    {"questionKey": "status", "operator": "equals", "value": "Active"}
  ]
}
```

**Show if status is Employed OR Self-Employed:**
```json
{
  "logic": "OR",
  "conditions": [
    {"questionKey": "status", "operator": "equals", "value": "Employed"},
    {"questionKey": "status", "operator": "equals", "value": "Self-Employed"}
  ]
}
```

**Show if email contains "company.com":**
```json
{
  "logic": "AND",
  "conditions": [
    {"questionKey": "email", "operator": "contains", "value": "company.com"}
  ]
}
```

---

## Response Status Codes

| Code | Meaning              | Common Cause                          |
|------|----------------------|---------------------------------------|
| 200  | Success              | Request completed successfully        |
| 201  | Created              | Resource created (form, response)     |
| 400  | Bad Request          | Invalid payload or validation error   |
| 401  | Unauthorized         | Missing or invalid x-user-id          |
| 403  | Forbidden            | User doesn't own resource             |
| 404  | Not Found            | Form or response doesn't exist        |
| 500  | Internal Server Error| Database or Airtable API error        |

---

## MongoDB Collections

### users
```javascript
{
  _id: ObjectId,
  airtableUserId: String,
  name: String,
  email: String,
  accessToken: String,
  refreshToken: String,
  loginTimestamp: Date,
  role: "user" | "admin"
}
```

### formschemas
```javascript
{
  _id: ObjectId,
  owner: ObjectId,
  airtableBaseId: String,
  airtableTableId: String,
  questions: [
    {
      questionKey: String,
      fieldId: String,
      label: String,
      type: String,
      required: Boolean,
      options: [String],
      conditionalRules: Object
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### formresponses
```javascript
{
  _id: ObjectId,
  formId: ObjectId,
  airtableRecordId: String,
  answers: Object,
  status: "submitted",
  deletedInAirtable: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Environment Variables Reference

```env
# Required
MONGODB_URI=mongodb://localhost:27017/dynoform
AIRTABLE_CLIENT_ID=cli_xxxxx
AIRTABLE_CLIENT_SECRET=secret_xxxxx
AIRTABLE_REDIRECT_URI=http://localhost:3000/api/auth/airtable/callback

# Optional (with defaults)
PORT=3000
NODE_ENV=development
SESSION_SECRET=random_secret
AIRTABLE_API_BASE_URL=https://api.airtable.com/v0
AIRTABLE_AUTH_BASE_URL=https://airtable.com/oauth2/v1
```

---

## Testing Utilities

### shouldShowQuestion Function

```typescript
import { shouldShowQuestion } from './utils/conditionalLogic';

// Returns true if question should be shown
const visible = shouldShowQuestion(
  {
    logic: 'AND',
    conditions: [
      { questionKey: 'status', operator: 'equals', value: 'Active' }
    ]
  },
  { status: 'Active' }  // Current answers
);
```

---

## Webhook Events

### record.updated
Updates MongoDB record with new field values

### record.deleted
Sets `deletedInAirtable: true` (soft delete)

---

## Role-Based Access

### User
- Can create forms
- Can view own forms
- Can view responses to own forms
- Cannot access other users' data

### Admin
- Full access to all forms
- Full access to all responses
- Can view all users

---

## Validation Rules

### Form Creation
- ✅ questionKey must be unique within form
- ✅ All questions must have: questionKey, fieldId, label, type
- ✅ Select types must have options array
- ✅ Conditional rules must reference previous questions only
- ✅ Only supported field types allowed

### Form Submission
- ✅ Required fields must be present (if question is visible)
- ✅ Single select values must be in options
- ✅ Multi-select values must all be in options
- ✅ Hidden questions (via conditional logic) are not validated
- ✅ Answers validated against question type

---

## Common Errors and Solutions

### "Form not found"
- Check formId is correct
- Ensure form exists in database

### "Access denied"
- Check x-user-id matches form owner
- Or user needs admin role

### "Unsupported field type"
- Only 5 field types supported
- Use GET /airtable/table/:baseId/:tableId/fields to see supported fields

### "Invalid condition reference"
- Conditional rules can only reference previous questions
- Check questionKey exists and comes before current question

### "Validation failed"
- Check all required fields are provided
- Verify select values are in options array
- Ensure field types match expected format

---

## Performance Tips

1. **Index Usage**
   - Queries on formId, owner, and airtableRecordId are indexed
   - Use includeDeleted=false for faster queries

2. **Batch Operations**
   - Consider batching form submissions
   - Use MongoDB bulk operations if needed

3. **Caching**
   - Cache Airtable field lists
   - Consider Redis for session storage

---

## Security Best Practices

1. **In Development**
   - Keep .env file secure
   - Don't commit secrets to git

2. **In Production**
   - Use JWT instead of x-user-id header
   - Enable rate limiting
   - Use HTTPS only
   - Validate all inputs
   - Sanitize outputs
   - Enable MongoDB authentication
   - Use secrets manager for credentials

---

## Useful MongoDB Queries

```javascript
// Find all forms for a user
db.formschemas.find({ owner: ObjectId("...") })

// Find active responses
db.formresponses.find({ deletedInAirtable: false })

// Count submissions per form
db.formresponses.aggregate([
  { $group: { _id: "$formId", count: { $sum: 1 } } }
])

// Find users who logged in recently
db.users.find({ 
  loginTimestamp: { $gte: new Date("2025-11-01") } 
})

// Make user an admin
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

---

## API Testing with cURL

### Minimal Form
```bash
curl -X POST http://localhost:3000/api/forms \
  -H "Content-Type: application/json" \
  -H "x-user-id: <userId>" \
  -d '{
    "airtableBaseId": "appXXX",
    "airtableTableId": "tblXXX",
    "questions": [
      {
        "questionKey": "q1",
        "fieldId": "fld1",
        "label": "Name",
        "type": "shortText",
        "required": true
      }
    ]
  }'
```

### Minimal Submission
```bash
curl -X POST http://localhost:3000/api/forms/<formId>/submit \
  -H "Content-Type: application/json" \
  -d '{"answers": {"q1": "John Doe"}}'
```

---

## Directory Structure at a Glance

```
backend/
├── src/
│   ├── config/          → database.ts
│   ├── controllers/     → 5 controllers
│   ├── middleware/      → auth.ts
│   ├── models/          → 3 models + index
│   ├── routes/          → index.ts (all routes)
│   ├── services/        → airtableService.ts
│   ├── utils/           → 2 utilities + tests
│   └── index.ts         → Express app
├── dist/                → Compiled JS (after build)
├── node_modules/
├── .env                 → Your secrets (git ignored)
├── .env.example         → Template
├── .gitignore
├── API_DOCUMENTATION.md → Full API docs
├── SETUP_GUIDE.md       → Step-by-step setup
├── TEST_PAYLOADS.json   → Sample payloads
├── jest.config.js       → Test configuration
├── package.json
├── tsconfig.json
└── QUICK_REFERENCE.md   → This file
```

---

**Pro Tip:** Bookmark this file for quick reference during development!
