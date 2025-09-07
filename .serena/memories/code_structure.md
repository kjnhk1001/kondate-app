# Codebase Structure

## Directory Structure

```
src/
├── app/                # Next.js App Router
│   ├── api/           # API routes for auth & menu operations
│   ├── auth/          # Authentication pages
│   └── page.tsx       # Main application page
├── components/        # Reusable UI components
│   └── ui/           # Generic UI components (Tabs, etc.)
├── features/         # Domain-specific functionality
│   ├── auth/         # Authentication feature
│   │   ├── components/ # SignInButton, etc.
│   │   ├── hooks/     # Auth-related hooks
│   │   ├── lib/       # Auth utilities
│   │   └── types.ts   # Auth types
│   └── menu/         # Menu feature
│       ├── components/ # MenuForm, MenuDisplay, DishCard, etc.
│       ├── hooks/     # useGenerateMenu, useSavedMenus
│       ├── lib/       # generateMenu, generateShoppingList
│       └── types.ts   # Menu, Dish, ShoppingListItem types
├── libs/             # External client configurations
│   ├── auth.ts       # Auth.js configuration
│   ├── openai.ts     # OpenAI client setup
│   └── prisma.ts     # Prisma client setup
├── hooks/            # Global custom hooks
├── utils/            # Shared utility functions
└── components/       # Shared components
```

## Key Architecture Patterns

- **Feature-based organization**: Each domain (auth, menu) has its own directory
- **Separation of concerns**: UI components separate from business logic
- **Type safety**: Comprehensive TypeScript with Zod validation
- **API Routes**: RESTful endpoints for menu generation, saving, and retrieval
