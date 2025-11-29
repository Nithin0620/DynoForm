# DynoForm Backend

A complete TypeScript backend for building dynamic forms with Airtable integration, OAuth authentication, conditional logic, and real-time webhook synchronization.

## 🎯 Features

- ✅ **Airtable OAuth 2.0** - Secure user authentication
- ✅ **Dynamic Form Builder** - Create forms from Airtable table fields
- ✅ **Conditional Logic** - Show/hide questions based on answers
- ✅ **Dual Storage** - Save submissions to both Airtable and MongoDB
- ✅ **Webhook Sync** - Real-time updates from Airtable
- ✅ **Role-Based Access** - Admin and user roles
- ✅ **Field Type Validation** - Only supported Airtable field types

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.ts    # OAuth flow
│   │   ├── airtableController.ts # Airtable data fetching
│   │   ├── formController.ts    # Form CRUD
│   │   ├── responseController.ts # Form submissions
│   │   └── webhookController.ts # Airtable webhooks
│   ├── middleware/
│   │   └── auth.ts              # Authentication & authorization
│   ├── models/
│   │   ├── User.ts              # User schema
│   │   ├── FormSchema.ts        # Form definition schema
│   │   ├── FormResponse.ts      # Submission schema
│   │   └── index.ts             # Model exports
│   ├── routes/
│   │   └── index.ts             # All API routes
│   ├── services/
│   │   └── airtableService.ts   # Airtable API wrapper
│   ├── utils/
│   │   ├── conditionalLogic.ts  # Pure function for conditions
│   │   └── fieldTypeValidation.ts # Field type helpers
│   └── index.ts                 # Express app entry point
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
└── tsconfig.json
```

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Airtable account with OAuth app credentials

### 2. Installation

```bash
cd backend
npm install
```

### 3. Environment Setup

Create a `.env` file:

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/dynoform

# Airtable OAuth
AIRTABLE_CLIENT_ID=your_client_id_here
AIRTABLE_CLIENT_SECRET=your_client_secret_here
AIRTABLE_REDIRECT_URI=http://localhost:3000/api/auth/airtable/callback

# Airtable API
AIRTABLE_API_BASE_URL=https://api.airtable.com/v0
AIRTABLE_AUTH_BASE_URL=https://airtable.com/oauth2/v1
```

### 4. Run the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

## 📚 API Documentation

### Authentication

#### `GET /api/auth/airtable`
Initiates OAuth flow with Airtable.

**Response:** Redirects to Airtable authorization page

---

#### `GET /api/auth/airtable/callback`
Handles OAuth callback and creates/updates user.

**Query Parameters:**
- `code` - Authorization code from Airtable
- `state` - State parameter

**Response:**
```json
{
  "success": true,
  "userId": "507f1f77bcf86cd799439011",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "john.doe",
    "email": "john.doe@example.com",
    "role": "user"
  }
}
```

---

### Airtable Data Selection

**Authentication Required:** Add header `x-user-id: <userId>`

#### `GET /api/airtable/bases`
List all Airtable bases accessible to the user.

**Response:**
```json
{
  "bases": [
    {
      "id": "appXXXXXXXXXXXXXX",
      "name": "My Base",
      "permissionLevel": "create"
    }
  ]
}
```

---

#### `GET /api/airtable/base/:baseId/tables`
List all tables in a base.

**Response:**
```json
{
  "tables": [
    {
      "id": "tblXXXXXXXXXXXXXX",
      "name": "Contacts",
      "primaryFieldId": "fldXXXXXXXXXXXXXX",
      "fields": [...]
    }
  ]
}
```

---

#### `GET /api/airtable/table/:baseId/:tableId/fields`
Get supported fields for a table.

**Response:**
```json
{
  "supportedFields": [
    {
      "id": "fldXXXXXXXXXXXXXX",
      "name": "Full Name",
      "type": "singleLineText",
      "mappedType": "shortText"
    },
    {
      "id": "fldYYYYYYYYYYYYYY",
      "name": "Status",
      "type": "singleSelect",
      "mappedType": "singleSelect",
      "options": ["Active", "Inactive"]
    }
  ],
  "unsupportedFields": [
    {
      "id": "fldZZZZZZZZZZZZZZ",
      "name": "Created Time",
      "type": "createdTime",
      "reason": "Unsupported field type"
    }
  ],
  "supportedCount": 5,
  "unsupportedCount": 2
}
```

---

### Form Management

**Authentication Required**

#### `POST /api/forms`
Create a new form schema.

**Request Body:**
```json
{
  "airtableBaseId": "appXXXXXXXXXXXXXX",
  "airtableTableId": "tblXXXXXXXXXXXXXX",
  "questions": [
    {
      "questionKey": "fullName",
      "fieldId": "fldXXXXXXXXXXXXXX",
      "label": "What is your full name?",
      "type": "shortText",
      "required": true
    },
    {
      "questionKey": "email",
      "fieldId": "fldYYYYYYYYYYYYYY",
      "label": "Email Address",
      "type": "shortText",
      "required": true
    },
    {
      "questionKey": "status",
      "fieldId": "fldZZZZZZZZZZZZZZ",
      "label": "Status",
      "type": "singleSelect",
      "required": true,
      "options": ["Active", "Inactive"]
    },
    {
      "questionKey": "reason",
      "fieldId": "fldAAAAAAAAAAAAA",
      "label": "Why inactive?",
      "type": "longText",
      "required": false,
      "conditionalRules": {
        "logic": "AND",
        "conditions": [
          {
            "questionKey": "status",
            "operator": "equals",
            "value": "Inactive"
          }
        ]
      }
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "formId": "507f1f77bcf86cd799439011",
  "form": { ... }
}
```

---

#### `GET /api/forms`
List all forms (user's forms or all if admin).

**Response:**
```json
{
  "forms": [...],
  "count": 5
}
```

---

#### `GET /api/form/:formId`
Get a specific form schema.

**Response:**
```json
{
  "form": {
    "_id": "507f1f77bcf86cd799439011",
    "owner": "507f191e810c19729de860ea",
    "airtableBaseId": "appXXXXXXXXXXXXXX",
    "airtableTableId": "tblXXXXXXXXXXXXXX",
    "questions": [...],
    "createdAt": "2025-11-29T10:00:00.000Z",
    "updatedAt": "2025-11-29T10:00:00.000Z"
  }
}
```

---

### Form Submission

#### `POST /api/forms/:formId/submit`
Submit a form response (saves to both Airtable and MongoDB).

**No authentication required for submission**

**Request Body:**
```json
{
  "answers": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "status": "Active"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "responseId": "507f1f77bcf86cd799439012",
  "airtableRecordId": "recXXXXXXXXXXXXXX",
  "response": { ... }
}
```

---

### Response Management

**Authentication Required**

#### `GET /api/forms/:formId/responses`
List all responses for a form (from MongoDB).

**Query Parameters:**
- `includeDeleted` (optional) - Set to "true" to include soft-deleted records

**Response:**
```json
{
  "formId": "507f1f77bcf86cd799439011",
  "responses": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "formId": "507f1f77bcf86cd799439011",
      "airtableRecordId": "recXXXXXXXXXXXXXX",
      "answers": {
        "fullName": "John Doe",
        "email": "john@example.com"
      },
      "status": "submitted",
      "deletedInAirtable": false,
      "createdAt": "2025-11-29T10:30:00.000Z",
      "updatedAt": "2025-11-29T10:30:00.000Z"
    }
  ],
  "count": 1,
  "includeDeleted": false
}
```

---

#### `GET /api/responses/:responseId`
Get a specific response.

**Response:**
```json
{
  "response": { ... }
}
```

---

### Webhooks

#### `POST /api/webhooks/airtable`
Webhook receiver for Airtable changes.

**No authentication required (webhook endpoint)**

Handles:
- **record.updated** - Updates MongoDB records with new data
- **record.deleted** - Soft deletes records (sets `deletedInAirtable: true`)

**Airtable Webhook Payload:**
```json
{
  "webhook": {
    "baseId": "appXXXXXXXXXXXXXX",
    "webhookId": "achXXXXXXXXXXXXXX",
    "timestamp": "2025-11-29T10:00:00.000Z",
    "actionMetadata": {
      "changedTablesById": {
        "tblXXXXXXXXXXXXXX": {
          "changedRecordsById": {
            "recXXXXXXXXXXXXXX": {
              "current": {
                "cellValuesByFieldId": {
                  "fldXXXXXXXXXXXXXX": "Updated Value"
                }
              }
            }
          },
          "destroyedRecordIds": ["recYYYYYYYYYYYYYY"]
        }
      }
    }
  }
}
```

---

#### `GET /api/webhooks/airtable/test`
Test webhook endpoint accessibility.

---

## 🔧 Supported Airtable Field Types

| Airtable Type | Internal Type | Description |
|--------------|---------------|-------------|
| singleLineText | shortText | Short text field |
| multilineText | longText | Long text field |
| singleSelect | singleSelect | Single choice dropdown |
| multipleSelects | multiSelect | Multiple choice dropdown |
| multipleAttachments | attachment | File attachments |

**Unsupported types** (automatically rejected):
- Checkbox, Date, Number, Formula, Lookup, Rollup, etc.

---

## 🧪 Conditional Logic

The `shouldShowQuestion` utility evaluates conditional rules:

### Operators

- **equals** - Strict equality (===)
- **notEquals** - Strict inequality (!==)
- **contains** - String contains (case-insensitive)

### Logic

- **AND** - All conditions must be true
- **OR** - At least one condition must be true

### Example

```typescript
{
  "conditionalRules": {
    "logic": "AND",
    "conditions": [
      {
        "questionKey": "hasAccount",
        "operator": "equals",
        "value": "Yes"
      },
      {
        "questionKey": "accountType",
        "operator": "notEquals",
        "value": "Guest"
      }
    ]
  }
}
```

---

## 🔐 Authorization

### Roles

- **user** - Can only access their own forms and responses
- **admin** - Can access all forms and responses

### Authentication

Use the `x-user-id` header with the user's MongoDB ObjectId:

```
x-user-id: 507f1f77bcf86cd799439011
```

**Note:** In production, replace this with JWT tokens or session-based auth.

---

## 📋 Sample Test Payloads

### Create Form

```json
{
  "airtableBaseId": "appXXXXXXXXXXXXXX",
  "airtableTableId": "tblXXXXXXXXXXXXXX",
  "questions": [
    {
      "questionKey": "q1_name",
      "fieldId": "fld001",
      "label": "Full Name",
      "type": "shortText",
      "required": true
    },
    {
      "questionKey": "q2_preference",
      "fieldId": "fld002",
      "label": "Preference",
      "type": "singleSelect",
      "required": true,
      "options": ["Option A", "Option B", "Option C"]
    },
    {
      "questionKey": "q3_details",
      "fieldId": "fld003",
      "label": "Tell us more about Option B",
      "type": "longText",
      "required": false,
      "conditionalRules": {
        "logic": "AND",
        "conditions": [
          {
            "questionKey": "q2_preference",
            "operator": "equals",
            "value": "Option B"
          }
        ]
      }
    }
  ]
}
```

### Submit Form

```json
{
  "answers": {
    "q1_name": "Jane Smith",
    "q2_preference": "Option B",
    "q3_details": "I chose Option B because it best fits my needs."
  }
}
```

---

## 🛠️ Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm test
```

---

## 🐛 Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (authorization failed)
- `404` - Not Found
- `500` - Internal Server Error

---

## 📝 Notes

### Webhook Setup

To register webhooks with Airtable:

1. Use the Airtable Web API to create a webhook
2. Set the notification URL to: `https://yourdomain.com/api/webhooks/airtable`
3. Subscribe to: `record.updated` and `record.deleted` events

### MongoDB Indexes

The models include indexes on:
- `User.airtableUserId`
- `User.email`
- `FormSchema.owner`
- `FormResponse.formId`
- `FormResponse.airtableRecordId`
- `FormResponse.deletedInAirtable`

---

## 🚀 Deployment

1. Set environment variables on your hosting platform
2. Ensure MongoDB is accessible
3. Run `npm run build`
4. Start with `npm start`
5. Configure Airtable OAuth redirect URI to your domain

---

## 📄 License

MIT

---

## 🤝 Contributing

This is a complete backend implementation. Extensions can include:
- JWT authentication
- Rate limiting
- Request validation with Joi/Zod
- Unit and integration tests
- API documentation with Swagger
- Logging with Winston/Pino

---

**Built with TypeScript, Express, MongoDB (Mongoose), and Airtable API**
