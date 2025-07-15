# Database Setup Guide

## Overview

We've migrated from Vercel KV to PostgreSQL for better data structure and query capabilities. This setup uses Prisma ORM for type-safe database operations.

## Prerequisites

- PostgreSQL database (local or cloud)
- Node.js and npm

## Setup Steps

### 1. Install Dependencies

```bash
npm install prisma @prisma/client
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/namerr_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Replicate
REPLICATE_API_TOKEN="your-replicate-api-token"
```

### 3. Database Setup Options

#### Option A: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database: `createdb namerr_db`
3. Update DATABASE_URL with your local credentials

#### Option B: Vercel Postgres (Recommended for Production)

1. Go to your Vercel project dashboard
2. Add a Postgres database from the Storage tab
3. Copy the connection string to your DATABASE_URL

#### Option C: Supabase (Free Tier Available)

1. Create a project at https://supabase.com
2. Get the connection string from Settings > Database
3. Update DATABASE_URL

### 4. Run Migrations

```bash
npx prisma migrate dev --name init
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

## Database Schema

### Users Table

- `id`: Unique identifier (CUID)
- `email`: User's email (unique)
- `name`: Display name
- `image`: Profile image URL
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### Saved Names Table

- `id`: Unique identifier (CUID)
- `familyId`: Foreign key to families table
- `firstName`: First name
- `lastName`: Last name
- `fullName`: Combined first and last name
- `origin`: Name origin information
- `feedback`: AI-generated feedback
- `middleNames`: Array of suggested middle names
- `similarNames`: Array of similar names
- `savedAt`: When the name was saved

## API Changes

### Save Name

**POST** `/api/save-name`

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "metadata": {
    "origin": "English",
    "feedback": "Strong and classic name",
    "middleNames": ["Michael", "William"],
    "similarNames": ["Jon", "Jonathan"]
  }
}
```

### Get Saved Names

**GET** `/api/saved-names`
Returns full metadata for all saved names.

### Remove Name

**DELETE** `/api/remove-name`

```json
{
  "nameId": "name-id-here"
}
```

## Benefits of PostgreSQL over KV

1. **Structured Data**: Proper schema with types and constraints
2. **Complex Queries**: Can search by any field, filter, sort
3. **Relationships**: Easy to join with user data
4. **Analytics**: Can run reports and insights
5. **Data Integrity**: ACID compliance and foreign key constraints
6. **Scalability**: Better for complex data operations

## Migration from KV

The old KV functions are still available in `src/lib/kv.ts` for backward compatibility, but new features use the database functions in `src/lib/database.ts`.

## Development Commands

```bash
# View database in browser
npx prisma studio

# Reset database (development only)
npx prisma migrate reset

# Push schema changes without migration
npx prisma db push
```
