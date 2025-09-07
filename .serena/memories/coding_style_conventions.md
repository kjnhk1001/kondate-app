# Coding Style & Conventions

## TypeScript Guidelines

- **Strict mode enabled** in tsconfig.json
- **No `any` types allowed** - use `unknown` and type narrowing instead
- **Comprehensive type definitions** in `features/*/types.ts`
- **Path aliases**: Use `@/*` for src imports

## Code Organization Principles

1. **Responsibility Separation**
   - UI components in `components/` and `features/*/components/`
   - Business logic in `features/*/hooks/` and `features/*/lib/`
   - External dependencies in `libs/`

2. **Domain-Driven Structure**
   - Features organized by domain (`features/menu`, `features/auth`)
   - Each feature self-contained with types, components, hooks, lib

3. **Type Safety**
   - OpenAI responses parsed through dedicated parser functions
   - Prisma queries use `select` to limit fields
   - Zod schemas for validation

## Naming Conventions

- **Components**: PascalCase (MenuForm, DishCard)
- **Hooks**: camelCase starting with `use` (useGenerateMenu)
- **Types**: PascalCase interfaces (Menu, Dish, ShoppingListItem)
- **Files**: camelCase for utilities, PascalCase for components

## Import Organization

- External libraries first
- Internal imports using `@/*` path alias
- Type imports explicitly marked with `type`

## ESLint Configuration

- Uses Next.js core-web-vitals and TypeScript configs
- Enforces consistent code style across the project
