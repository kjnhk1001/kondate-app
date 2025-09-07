# Task Completion Checklist

When completing any development task, follow these steps:

## Code Quality Checks

1. **Run linting**: `npm run lint`
   - Fix any ESLint errors or warnings
   - Ensure code follows Next.js and TypeScript best practices

2. **Type checking**: TypeScript compilation happens during build
   - Run `npm run build` to verify no type errors
   - Ensure all types are properly defined

3. **Test functionality manually**
   - Run `npm run dev` and test changes in browser
   - Verify authentication flow works
   - Test menu generation and saving features

## Database Changes

- If Prisma schema modified: run `npx prisma generate`
- If database structure changed: run `npx prisma db push`
- Verify migrations work correctly

## Code Standards Verification

- No `any` types used
- Proper error handling implemented
- External API calls properly typed and validated
- Components follow separation of concerns
- New features follow existing patterns

## Documentation

- Update CLAUDE.md if adding new features or changing architecture
- Ensure type definitions are comprehensive
- Add comments only when necessary for complex logic

## Pre-commit Checklist

- All files properly formatted
- No console.log statements in production code
- Environment variables properly configured
- No hardcoded secrets or API keys
