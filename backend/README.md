# 🚀 DynoForm Backend

> Complete TypeScript backend for dynamic form building with Airtable integration

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Compatible-green.svg)](https://www.mongodb.com/)

---

## ✨ Features

- 🔐 **OAuth 2.0** authentication with Airtable
- 📝 **Dynamic forms** built from Airtable tables
- 🎯 **Conditional logic** - show/hide questions based on answers
- 💾 **Dual storage** - Airtable (primary) + MongoDB (cache)
- 🔄 **Real-time sync** via Airtable webhooks
- 👥 **Role-based access** - user and admin roles
- ✅ **Field validation** - only supported Airtable types
- 🧪 **Fully tested** conditional logic

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** | Complete API reference with examples |
| **[SETUP_GUIDE.md](SETUP_GUIDE.md)** | Step-by-step setup instructions |
| **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** | Quick lookup for common tasks |
| **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** | Full project overview |
| **[FILE_TREE.md](FILE_TREE.md)** | Visual project structure |
| **[TEST_PAYLOADS.json](TEST_PAYLOADS.json)** | Sample JSON requests |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Airtable OAuth credentials

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 3. Start development server
npm run dev
```

Server starts at `http://localhost:3000`

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Airtable      │ ← OAuth 2.0, Records, Webhooks
└────────┬────────┘
         │
    ┌────▼────────────────┐
    │  Express Backend    │
    │  - Controllers      │
    │  - Services         │
    │  - Middleware       │
    └────┬────────────────┘
         │
    ┌────▼────────┐
    │  MongoDB    │ ← Local cache & responses
    └─────────────┘
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Database connection
│   ├── controllers/     # Route handlers (5 files)
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose schemas (3 models)
│   ├── routes/          # API routes (14 endpoints)
│   ├── services/        # Airtable API wrapper
│   ├── utils/           # Pure functions & helpers
│   └── index.ts         # Express app entry point
├── API_DOCUMENTATION.md
├── SETUP_GUIDE.md
├── package.json
└── tsconfig.json
```

---

## 🔌 API Endpoints

### Authentication
- `GET /api/auth/airtable` - Start OAuth flow
- `GET /api/auth/airtable/callback` - OAuth callback

### Airtable Data
- `GET /api/airtable/bases` - List bases
- `GET /api/airtable/base/:baseId/tables` - List tables
- `GET /api/airtable/table/:baseId/:tableId/fields` - Get fields

### Forms
- `POST /api/forms` - Create form
- `GET /api/forms` - List forms
- `GET /api/form/:id` - Get form

### Submissions
- `POST /api/forms/:id/submit` - Submit response
- `GET /api/forms/:id/responses` - List responses

### Webhooks
- `POST /api/webhooks/airtable` - Webhook receiver

[Full API documentation →](API_DOCUMENTATION.md)

---

## 🎯 Supported Field Types

Only these Airtable field types are supported:

- ✅ **singleLineText** → `shortText`
- ✅ **multilineText** → `longText`
- ✅ **singleSelect** → `singleSelect`
- ✅ **multipleSelects** → `multiSelect`
- ✅ **multipleAttachments** → `attachment`

Unsupported types (checkbox, date, formula, etc.) are automatically rejected.

---

## 🧠 Conditional Logic

Questions can be shown/hidden based on previous answers:

```json
{
  "conditionalRules": {
    "logic": "AND",
    "conditions": [
      {
        "questionKey": "status",
        "operator": "equals",
        "value": "Active"
      }
    ]
  }
}
```

**Operators:** `equals`, `notEquals`, `contains`  
**Logic:** `AND`, `OR`

---

## 💾 Database Models

### User
```typescript
{
  airtableUserId: string
  name: string
  email: string
  accessToken: string
  role: "user" | "admin"
  loginTimestamp: Date
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
}
```

### FormResponse
```typescript
{
  formId: ObjectId
  airtableRecordId: string
  answers: Record<string, any>
  deletedInAirtable: boolean
  createdAt: Date
}
```

---

## 🔧 Scripts

```bash
npm run dev    # Development with auto-reload
npm run build  # Compile TypeScript
npm start      # Run production build
npm test       # Run tests
```

---

## 🔒 Security

### Implemented
- Environment-based configuration
- CORS middleware
- Input validation on all endpoints
- MongoDB injection protection
- Role-based authorization

### Production Recommendations
- Replace header auth with JWT
- Add rate limiting
- Enable HTTPS only
- Use Helmet.js
- Add request logging

---

## 🧪 Testing

```bash
npm test
```

Runs Jest test suite with 24+ test cases for conditional logic.

---

## 📝 Environment Variables

Required variables (see `.env.example`):

```env
MONGODB_URI=mongodb://localhost:27017/dynoform
AIRTABLE_CLIENT_ID=your_client_id
AIRTABLE_CLIENT_SECRET=your_client_secret
AIRTABLE_REDIRECT_URI=http://localhost:3000/api/auth/airtable/callback
```

[Full setup guide →](SETUP_GUIDE.md)

---

## 🔄 Webhook Sync

Airtable webhooks keep MongoDB in sync:

- **record.updated** → Updates local record
- **record.deleted** → Soft delete (sets flag)

No polling required. No local hard deletes.

---

## 🎓 Example Usage

### 1. Authenticate

```bash
# Opens browser for OAuth
open http://localhost:3000/api/auth/airtable
```

### 2. Create Form

```bash
curl -X POST http://localhost:3000/api/forms \
  -H "Content-Type: application/json" \
  -H "x-user-id: <userId>" \
  -d @form-payload.json
```

### 3. Submit Response

```bash
curl -X POST http://localhost:3000/api/forms/<formId>/submit \
  -H "Content-Type: application/json" \
  -d '{"answers": {"name": "John Doe"}}'
```

[Full examples →](TEST_PAYLOADS.json)

---

## 🛠️ Tech Stack

- **Runtime:** Node.js 18+
- **Language:** TypeScript 5.3
- **Framework:** Express 5.1
- **Database:** MongoDB + Mongoose 9.0
- **HTTP Client:** Axios 1.6
- **Validation:** express-validator 7.0
- **Testing:** Jest + ts-jest

---

## 📊 Code Statistics

- **TypeScript Files:** 17
- **Controllers:** 5
- **Models:** 3
- **API Endpoints:** 14
- **Test Cases:** 24+
- **Documentation Lines:** 2,000+

---

## 🤝 Contributing

This is a reference implementation. Feel free to:

- Add frontend (React, Vue, etc.)
- Implement JWT authentication
- Add more tests
- Create OpenAPI/Swagger docs
- Extend field type support

---

## 📄 License

MIT

---

## 🆘 Support

- **Setup issues?** See [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **API questions?** See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Quick lookup?** See [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

---

## ✅ Implementation Status

- ✅ OAuth 2.0 authentication
- ✅ Form builder with validation
- ✅ Conditional logic (pure function)
- ✅ Dual storage (Airtable + MongoDB)
- ✅ Webhook synchronization
- ✅ Role-based authorization
- ✅ Field type filtering
- ✅ Comprehensive documentation
- ✅ Test suite
- ✅ Production-ready structure

---

**Built with TypeScript, Express, MongoDB, and Airtable API**

*Complete backend implementation - ready to use! 🎉*
