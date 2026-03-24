# OfferlyFE

A web application to track and organize job applications efficiently.

## Description

OfferlyFE is a frontend application built with Next.js that allows users to manage their job applications. Users can add, edit, delete, and organize their job applications in a Kanban-style board.

## Features

- Main dashboard with application statistics
- Kanban system to organize applications by status
- Modal for adding/editing job applications
- Application states: Saved, Applied, In Progress, Closed
- Confirmation for edit/delete actions
- Success/error notifications
- Responsive design
- User authentication

## Technologies

- Next.js 16.1.6
- React 19.2.3
- TypeScript
- React Query for state management
- React Icons
- AOS for animations
- Axios for HTTP requests
- Zustand for global state

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Lenin-Miranda/OfferlyFE.git
cd OfferlyFE
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run start` - Starts the production application
- `npm run lint` - Runs the linter

## Project Structure

```
src/
├── app/
│   ├── Components/     # Reusable components
│   ├── dashboard/      # Main dashboard page
│   └── login/          # Login page
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── lib/                # Utils and configurations
├── providers/          # Application providers
├── stores/             # Global states
├── types/              # TypeScript definitions
└── utils/              # Utility functions
```

## Application States

- **Saved**: Application saved to apply later
- **Applied**: Application submitted
- **Interviewing**: Interview process ongoing
- **Offer**: Offer received
- **Rejected**: Application rejected
- **Accepted**: Offer accepted
- **Withdrawn**: Application withdrawn
- **Ghosted**: No response from employer
