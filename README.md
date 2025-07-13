# Namerr - AI-Powered Baby Name Rater

A modern web application that helps parents find the perfect baby name using AI-powered analysis. Built with Next.js, TypeScript, and PostgreSQL.

## 🌟 Features

- **AI Name Analysis**: Get detailed feedback on baby names using Meta's Llama 3.1 model
- **Name Origin & Popularity**: Learn about name origins and historical popularity trends
- **Middle Name Suggestions**: Get curated middle name recommendations
- **Similar Name Discovery**: Find alternative names with similar qualities
- **User Authentication**: Secure Google OAuth login with NextAuth.js
- **Name Saving**: Save and organize your favorite names
- **Smart Caching**: Fast responses with intelligent caching system
- **Responsive Design**: Beautiful UI that works on all devices

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **AI**: Replicate API (Meta Llama 3.1 405B)
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google OAuth credentials
- Replicate API token

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd namerr
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/namerr_db"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Replicate AI
   REPLICATE_API_TOKEN="your-replicate-api-token"
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Database Setup

The application uses PostgreSQL with Prisma ORM. See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed setup instructions.

### Authentication Setup

Google OAuth is configured for user authentication. See [AUTH_SETUP.md](./AUTH_SETUP.md) for detailed setup instructions.

### AI Model Configuration

The application uses Meta's Llama 3.1 405B model via Replicate API for name analysis. You'll need to:

1. Sign up at [replicate.com](https://replicate.com)
2. Get your API token
3. Add it to your environment variables

## 📖 Usage

1. **Sign in** with your Google account
2. **Enter a name** you're considering for your baby
3. **Select gender** (boy/girl)
4. **Get AI analysis** including:
   - Name feedback and aesthetic qualities
   - Origin and meaning
   - Popularity trends
   - Middle name suggestions
   - Similar name alternatives
5. **Save names** you like to your personal collection
6. **Browse saved names** anytime

## 🏗️ Project Structure

```
namerr/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── api/            # API routes
│   │   │   ├── auth/       # Authentication endpoints
│   │   │   ├── rate-name/  # Name rating API
│   │   │   ├── save-name/  # Save name API
│   │   │   └── ...
│   │   ├── page.tsx        # Main application page
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── AuthSection.tsx
│   │   ├── NameInputForm.tsx
│   │   └── ...
│   └── lib/               # Utility functions
│       ├── auth.ts        # NextAuth configuration
│       ├── database.ts    # Database operations
│       ├── network.ts     # AI API integration
│       └── types.ts       # TypeScript types
├── prisma/                # Database schema and migrations
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🔌 API Endpoints

- `POST /api/rate-name` - Get AI analysis for a name
- `POST /api/save-name` - Save a name to user's collection
- `GET /api/saved-names` - Retrieve user's saved names
- `DELETE /api/remove-name` - Remove a name from collection
- `GET /api/cache-name` - Get cached name data
- `POST /api/admin/cache` - Admin cache management

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Prisma](https://prisma.io/) for the excellent ORM
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- [Replicate](https://replicate.com/) for AI model hosting
- [Meta](https://ai.meta.com/) for the Llama 3.1 model

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

Made with ❤️ for expecting parents everywhere
