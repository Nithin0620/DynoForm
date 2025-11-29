# DynoForm Frontend

A clean, minimal React frontend for DynoForm built with TypeScript, Zustand, and Axios.

## Features

- **Authentication**: OAuth 2.0 with Airtable
- **Form Builder**: Multi-step form creation workflow
- **Form Submission**: Dynamic field rendering with conditional logic
- **Dashboard**: Manage forms and view responses
- **State Management**: Zustand stores for auth, forms, and Airtable data
- **API Integration**: Axios client with TypeScript types

## Tech Stack

- React 19
- TypeScript
- Zustand (state management)
- Axios (HTTP client)
- React Router DOM (routing)
- Vite (build tool)

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Create \`.env\` file:
\`\`\`env
VITE_API_URL=http://localhost:3000/api
\`\`\`

3. Start development server:
\`\`\`bash
npm run dev
\`\`\`

## Project Structure

\`\`\`
src/
├── lib/
│   └── api.ts              # Axios client and API functions
├── pages/
│   ├── Login.tsx           # Login page
│   ├── AuthCallback.tsx    # OAuth callback handler
│   ├── Dashboard.tsx       # Forms dashboard
│   ├── CreateForm.tsx      # Multi-step form creation
│   ├── FormSubmit.tsx      # Public form submission
│   └── FormResponses.tsx   # View form responses
├── store/
│   ├── authStore.ts        # Authentication state
│   ├── formsStore.ts       # Forms state
│   └── airtableStore.ts    # Airtable data state
├── types/
│   └── api.ts              # TypeScript types
├── App.tsx                 # Router and routes
└── main.tsx                # App entry point
\`\`\`

## Routes

- \`/login\` - Login page
- \`/auth/callback\` - OAuth callback
- \`/dashboard\` - Forms dashboard (protected)
- \`/forms/create\` - Create new form (protected)
- \`/forms/:formId/responses\` - View responses (protected)
- \`/submit/:formId\` - Public form submission

## API Integration

All API calls are handled through the Axios client in \`lib/api.ts\`. The client automatically includes the user ID header for authenticated requests.

## State Management

Three Zustand stores manage application state:

- \`authStore\` - User authentication and session
- \`formsStore\` - Forms and responses data
- \`airtableStore\` - Airtable bases, tables, and fields

## Design Philosophy

- Minimal UI with no animations
- Clean, functional design
- Focus on usability over aesthetics
- Inline styles for simplicity
