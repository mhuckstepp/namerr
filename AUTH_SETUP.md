# Authentication Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth (Get these from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Vercel KV (Get these from Vercel Dashboard)
KV_URL=your-kv-url
KV_REST_API_URL=your-kv-rest-api-url
KV_REST_API_TOKEN=your-kv-rest-api-token
KV_REST_API_READ_ONLY_TOKEN=your-kv-read-only-token

# Replicate API (for name rating)
REPLICATE_API_TOKEN=your-replicate-api-token
```

## Setup Steps

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://your-domain.vercel.app/api/auth/callback/google` (for production)
7. Copy the Client ID and Client Secret to your `.env.local`

### 2. Vercel KV Setup

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Storage" tab
4. Create a new KV database
5. Copy the connection details to your `.env.local`

### 3. Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

### 4. Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy!

## Features

- ✅ Google OAuth authentication
- ✅ Save favorite names to Vercel KV
- ✅ View saved names list
- ✅ Persistent storage across sessions
- ✅ Responsive UI with loading states

## API Endpoints

- `POST /api/save-name` - Save a name for the authenticated user
- `GET /api/saved-names` - Get all saved names for the authenticated user
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js authentication routes
