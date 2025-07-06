# Namerr - Baby Name Helper

A monorepo containing both the frontend and backend for the Namerr baby name helper application.

## Project Structure

```
namerr-backend/
├── packages/
│   ├── frontend/          # Next.js frontend application
│   ├── backend/           # Express.js backend API
│   └── shared/            # Shared types and utilities
├── package.json           # Root workspace configuration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 7+ (for workspaces)

### Installation

1. Install all dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
# Create .env file in packages/backend/
cp packages/backend/.env.example packages/backend/.env
# Add your REPLICATE_API_TOKEN to the .env file
```

### Development

#### Run both frontend and backend:

```bash
npm run dev
```

#### Run only frontend:

```bash
npm run dev --workspace=frontend
```

#### Run only backend:

```bash
npm run dev --workspace=backend
```

### Building

Build all packages:

```bash
npm run build
```

Build specific package:

```bash
npm run build --workspace=frontend
npm run build --workspace=backend
```

## Frontend (Next.js)

The frontend is built with:

- **Next.js 14** with App Router
- **TypeScript**
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Lucide React** for icons

### Features

- Beautiful, responsive UI
- Real-time name rating
- Middle name suggestions
- Similar name recommendations
- Multiple name styles (Artsy, Polite, Unique, Classic, Modern, Nature)

### Development

```bash
cd packages/frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Backend (Express.js)

The backend provides:

- RESTful API endpoints
- Integration with Replicate AI for name analysis
- CORS support for frontend communication

### API Endpoints

- `POST /api/rate-name` - Rate a name combination
- `GET /health` - Health check endpoint

### Development

```bash
cd packages/backend
npm run dev
```

The backend will be available at `http://localhost:3001`

## Shared Package

Contains common types and utilities used by both frontend and backend:

- TypeScript interfaces
- Common constants
- Shared utilities

## Deployment

### Frontend (Vercel)

The frontend is configured for Vercel deployment with `vercel.json`.

### Backend

Deploy the backend to your preferred hosting service (Railway, Render, etc.).

## Environment Variables

### Backend (.env)

```
REPLICATE_API_TOKEN=your_replicate_token_here
PORT=3001
```

### Frontend

The frontend will automatically connect to the backend at `http://localhost:3001` in development. For production, set the `BACKEND_URL` environment variable.

## Contributing

1. Make changes in the appropriate package
2. Test both frontend and backend
3. Build all packages before committing
4. Update shared types if needed

## License

MIT
