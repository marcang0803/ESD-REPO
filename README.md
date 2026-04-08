# Radiant Sanctuary

Monorepo for the Radiant Sanctuary app.

## Repo layout

```text
react/
  backend/      # Backend service (currently scaffold/placeholder)
  frontend/     # React + Vite PWA client
  .env.example  # Shared env template for frontend + backend
  .gitignore
```

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+

## Shared environment setup

Create a root `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Current shared variable:

```env
VITE_BACKEND_TARGET=http://127.0.0.1:8000
```

Frontend uses this for `/api/*` proxying via Vite.

## Frontend

From `frontend/`:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

Useful commands:

- `npm run dev`
- `npm run dev:local`
- `npm run build`
- `npm run preview`
- `npm run preview:local`

PWA testing:

```bash
npm run build
npm run preview
```

### One-line build and test (from frontend/)

```bash
npm run build && npm run dev
```

This will build the app and immediately start the development server for quick testing.

## Backend

`backend/` is present but currently does not contain runnable service files yet.

When backend code is added, document:

- framework/runtime
- install/start commands
- required env vars
- local API base URL/port

## Sharing with friends

Share source without generated artifacts.

Already ignored by git:

- env local files (`.env`, `.env.local`, `.env.*.local`)
- frontend build/deps (`frontend/dist`, `frontend/node_modules`)
