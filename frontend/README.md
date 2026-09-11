# Kortex College Portal — Frontend

Premium React + TypeScript + Vite frontend for the Kortex college workflow.

## Features

- Student dashboard
- Events and event details
- QR-style check-in flow
- Attendance history and conflict reporting
- Points and leaderboard
- Student profile
- Faculty dashboard
- Faculty attendance requests
- Admin dashboard
- Pending approvals
- Timetable import UI
- Audit logs
- Responsive sidebar/header
- Local mock API so the UI works immediately without a backend
- API mode for connecting to a real backend

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Backend mode

Create `.env`:

```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=http://localhost:8000/api
```

The frontend expects REST-style endpoints. The service files are isolated so you can map them to the exact backend later.

## Demo accounts

The mock API accepts any non-empty email/password. Role is inferred from email:

- `student@college.edu`
- `faculty@college.edu`
- `admin@college.edu`

You can also select the role directly on the login screen.

## Build

```bash
npm run build
```
