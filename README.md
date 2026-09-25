# Offerly Frontend

Next.js application for organizing job applications, reviewing application statistics and managing candidate information. Uses React, TypeScript, React Query, Axios and Zustand.

**Backend:** [OfferlyBE](https://github.com/Lenin-Miranda/OfferlyBE).

## Setup

Requires Node.js, npm and the backend for account and application data.

```bash
git clone https://github.com/Lenin-Miranda/OfferlyFE.git
cd OfferlyFE
npm install
```

Create `.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_APP_NAME=Offerly
```

Start the API on port `4000` with `CORS_ORIGIN=http://localhost:3000`, then:

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000). The API value includes `/api`; leaving it unset uses the code's `http://localhost:3001/api` fallback, which must match your backend configuration.

## Features

- Application dashboard and Kanban-style organization.
- Forms for creating and editing applications.
- Account/login screens and request feedback.
- Candidate-profile and resume-related API integration.

Status values and payload types should be taken from the current frontend types and backend models when extending the board.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run lint` | ESLint |
| `npm run build` | Production build |
| `npm start` | Serve the production build |

## Structure

- `src/app/`: routes, dashboard and UI components.
- `src/lib/`: API clients and shared helpers.
- `src/hooks/`, `src/providers/`, `src/stores/`: data/state behavior.
- `src/types/`: TypeScript data contracts.

## Troubleshooting

Restart Next.js after environment changes. If login does not persist, confirm the API origin, CORS credentials and cookie settings on both sides. AI-assisted endpoints need the backend's provider configuration; no provider secret belongs in a `NEXT_PUBLIC_*` variable. No automated test script is configured.
