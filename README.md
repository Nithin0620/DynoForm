# DynoForm

A complete full-stack dynamic form builder with Airtable integration, OAuth authentication, conditional logic, and real-time synchronization.

## 🎯 Project Overview

DynoForm allows users to:
1. **Authenticate** with Airtable using OAuth 2.0
2. **Select** Airtable bases and tables to build forms from
3. **Create** dynamic forms with conditional logic
4. **Submit** form responses (saved to both Airtable and MongoDB)
5. **Sync** automatically via Airtable webhooks
6. **View** all submissions from MongoDB

## 🏗️ Architecture

### Backend (TypeScript + Node.js + Express + MongoDB)
- ✅ **Fully implemented** in `backend/` directory
- RESTful API with comprehensive validation
- Dual-storage: Airtable (primary) + MongoDB (local cache)
- Real-time webhook sync (no polling)
- Role-based access control (admin/user)

### Key Features
- OAuth 2.0 flow with Airtable
- Pure function conditional logic evaluation
- Support for 5 Airtable field types only
- Soft deletes (no local hard deletes)
- Comprehensive error handling

## 📁 Repository Structure

```
DynoForm/
├── backend/              # Complete TypeScript backend ✅
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── controllers/ # Route handlers
│   │   ├── middleware/  # Auth & authorization
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # API routes
│   │   ├── services/    # Airtable API service
│   │   ├── utils/       # Conditional logic & validation
│   │   └── index.ts     # Express app
│   ├── API_DOCUMENTATION.md  # Full API docs
│   ├── TEST_PAYLOADS.json    # Sample requests
│   ├── package.json
│   └── tsconfig.json
├── frontend/            # UI (not implemented)
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Airtable account with OAuth credentials

### Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your Airtable credentials and MongoDB URI
```

3. **Start the server:**
```bash
npm run dev
```

The API will be available at `http://localhost:3000/api`

## 📚 Documentation

- **[API Documentation](backend/API_DOCUMENTATION.md)** - Complete API reference
- **[Test Payloads](backend/TEST_PAYLOADS.json)** - Sample requests for testing

## 🔑 Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/airtable` | GET | Start OAuth flow |
| `/api/auth/airtable/callback` | GET | OAuth callback |
| `/api/airtable/bases` | GET | List user's bases |
| `/api/airtable/base/:id/tables` | GET | List tables |
| `/api/airtable/table/:baseId/:tableId/fields` | GET | Get supported fields |
| `/api/forms` | POST | Create form |
| `/api/forms` | GET | List forms |
| `/api/form/:id` | GET | Get form |
| `/api/forms/:id/submit` | POST | Submit response |
| `/api/forms/:id/responses` | GET | List responses |
| `/api/webhooks/airtable` | POST | Webhook receiver |

## 🔧 Supported Field Types

Only these Airtable field types are supported:

| Airtable Type | Internal Type | Use Case |
|--------------|---------------|----------|
| singleLineText | shortText | Name, email, etc. |
| multilineText | longText | Comments, descriptions |
| singleSelect | singleSelect | Dropdown (one choice) |
| multipleSelects | multiSelect | Dropdown (multi-choice) |
| multipleAttachments | attachment | File uploads |

**All other field types are automatically rejected.**

## 🎯 Conditional Logic

Questions can be shown/hidden based on previous answers:

```json
{
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
```

**Operators:** `equals`, `notEquals`, `contains`  
**Logic:** `AND`, `OR`

## 🔐 Authorization

Two roles are supported:
- **user** - Can only access own forms/responses
- **admin** - Can access everything

Authentication uses `x-user-id` header (replace with JWT in production).

## 📊 Database Models

### User
```typescript
{
  airtableUserId: string
  name: string
  email: string
  accessToken: string
  refreshToken: string
  loginTimestamp: Date
  role: "user" | "admin"
}
```

### FormSchema
```typescript
{
  owner: ObjectId
  airtableBaseId: string
  airtableTableId: string
  questions: IQuestion[]
  createdAt: Date
  updatedAt: Date
}
```

### FormResponse
```typescript
{
  formId: ObjectId
  airtableRecordId: string
  answers: Record<string, any>
  status: "submitted"
  deletedInAirtable: boolean
  createdAt: Date
  updatedAt: Date
}
```

## 🔄 Webhook Sync

Airtable webhooks keep MongoDB in sync:

- **record.updated** → Updates local record
- **record.deleted** → Soft delete (sets `deletedInAirtable: true`)

No polling required. No local hard deletes.

## 🧪 Testing

See `backend/TEST_PAYLOADS.json` for complete examples:
- Creating forms with conditional logic
- Submitting responses
- Multi-select validation
- Attachment handling
- Complex conditional rules

## 🛠️ Development

```bash
# Development mode with auto-reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run tests (when implemented)
npm test
```

## 📝 Implementation Notes

### What's Complete ✅
- Full OAuth 2.0 flow with Airtable
- All CRUD operations for forms and responses
- Conditional logic evaluation (pure function)
- Field type validation and filtering
- Dual-save to Airtable + MongoDB
- Webhook receiver with soft deletes
- Role-based authorization
- Comprehensive error handling

### What's Not Included ❌
- Frontend UI
- JWT token implementation (using simple header auth)
- Unit/integration tests
- Rate limiting
- Request logging (basic console.log only)
- API documentation UI (Swagger)

### Production Considerations
1. Replace `x-user-id` header with JWT tokens
2. Add rate limiting (express-rate-limit)
3. Implement proper logging (Winston/Pino)
4. Add request validation schemas (Zod/Joi)
5. Set up monitoring and error tracking
6. Configure CORS for specific origins
7. Add database backups
8. Implement API versioning

## 🔒 Security

Current implementation:
- Environment variables for secrets
- MongoDB injection protection (Mongoose)
- CORS enabled
- Input validation on all endpoints

Recommended additions:
- Helmet.js for security headers
- Rate limiting per IP/user
- Request size limits
- SQL injection protection (already handled by Mongoose)
- XSS protection in responses

## 📄 License

MIT

## 🤝 Contributing

This is a complete backend reference implementation. Feel free to:
- Add frontend (React, Vue, etc.)
- Implement JWT authentication
- Add comprehensive tests
- Create Swagger/OpenAPI docs
- Add more field type support
- Implement batch operations

---

**Built with:**
- TypeScript
- Node.js + Express
- MongoDB + Mongoose
- Airtable API
- OAuth 2.0