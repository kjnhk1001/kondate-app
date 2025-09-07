# Suggested Development Commands

## Development Workflow
```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Database Operations
```bash
# Generate Prisma client after schema changes
npx prisma generate

# Apply database migrations
npx prisma db push

# View database in Prisma Studio
npx prisma studio

# Reset database (development only)
npx prisma db push --force-reset
```

## Git Workflow
```bash
# Standard git operations on macOS
git status
git add .
git commit -m "message"
git push origin main
```

## System Utilities (macOS)
```bash
# File operations
ls -la          # List files with details
find . -name    # Find files by name
grep -r         # Search in files (prefer rg if available)
open .          # Open current directory in Finder
```

## Environment Setup
- Uses **mise** for tool management (see mise.toml)
- Ensure PostgreSQL is running for database operations
- Environment variables needed: DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, OPENAI_API_KEY