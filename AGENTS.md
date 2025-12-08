# Repository Guidelines

> **Note:** This project is based on the boilerplate at `/Users/charlie/Sites/PROJECTS/boilerplate`. Any important general architecture decisions or guidelines added here should also be reflected in the boilerplate's AGENTS.md to keep them in sync.

## Project Structure & Module Organization
- `src/app` contains Next.js App Router entries, layouts, and metadata.
- `src/components` hosts reusable UI; primitives live under `ui/`, while folders like `form/` and `navigation/` wrap them into features.
- `src/server` houses tRPC procedures, Prisma-backed services, email templates, and AI helpers; keep server-only code here.
- Shared utilities, configs, and hooks belong in `src/lib`, `src/config`, and `src/hooks`; add new modules alongside peers.
- `prisma/` defines the data model and migrations, and `public/` stores static assets served directly.

## Build, Test, and Development Commands
- `npm run dev` starts the Next.js dev server with Turbopack for rapid iteration.
- `npm run build` produces the production bundle; `npm run preview` builds then serves it.
- `npm run check` (ESLint + `tsc`) is the pre-push gate; `npm run lint[:fix]` and `npm run format:(check|write)` keep style aligned.
- Database helpers: `npm run db:start`, `npm run db:generate -- --name="migration name"`, `npm run db:migrate`, `npm run db:reset`.
- `npm run email` spins up the mail previewer for templates in `src/server/emails`.

## Coding Style & Naming Conventions
- Write TypeScript, co-locating supporting types in `src/types` or next to the consumer.
- Prettier (2-space indent, semicolons) plus `prettier-plugin-tailwindcss` handles formatting and Tailwind class order.
- ESLint (Next.js + `typescript-eslint`) enforces async safety and import hygiene—resolve warnings before reviews.
- Component files use kebab-case (`rich-text-editor.tsx`), while exports remain PascalCase; prefer named exports except for Next route handlers.

## Testing Guidelines
- Automated tests are not yet configured; rely on `npm run check` and manual flows in `npm run dev`.
- Coordinate before introducing a test runner; target `*.test.ts(x)` colocated with the feature and document new commands in `package.json`.
- Focus coverage on tRPC procedures, Prisma data access, and critical UI state transitions.

## Commit & Pull Request Guidelines
- Use concise, imperative commit subjects (e.g., `Add dashboard step validator`) with optional bodies for context.
- Keep commits focused; avoid mixing schema migrations with unrelated UI tweaks.
- PR descriptions should summarize impact, list touched routes, link issues, and include screenshots/GIFs for UI changes.
- Note environment or schema updates prominently and confirm `npm run check` (plus any added tests) before requesting review.

## Database & Environment
- Copy `.env.example` to `.env.local`, filling Clerk, Stripe, and database credentials.
- Use `start-database.sh` to launch the local Postgres service; rerun `npm run db:reset` when migrations drift.
- Let `postinstall` regenerate Prisma clients; do not commit generated artifacts.

### Database Migrations (IMPORTANT)
- **NEVER use `prisma db push`** - it can cause data loss and doesn't create migration files.
- **ALWAYS use `npm run db:generate -- --name="descriptive-name"`** to create and apply migrations.
- If `prisma migrate dev` fails due to non-interactive environment, ask the user to run it manually rather than falling back to `db push`.
- Migration names should be descriptive (e.g., `add-subscription-fields`, `create-user-table`).

## Patterns for AI Coding Tools

### API Layer Organization
- **Router Structure**: Organize tRPC routers by domain/feature (e.g., `userRouter`, `adventureRouter`). Each router file exports a single router created with `createTRPCRouter`.
- **Procedure Types**: Use `publicProcedure` for unauthenticated endpoints and `protectedProcedure` for authenticated ones. Apply middleware consistently across related procedures.
- **Input Validation**: Always use Zod schemas for procedure inputs. Co-locate validation schemas with routers or in `src/lib/validations` organized by domain.
- **Error Handling**: Leverage tRPC's error formatter to surface Zod validation errors to the client. Use `TRPCError` with appropriate status codes for business logic failures.

### Form Patterns
- **Form Hook**: Use a centralized form hook (`useAppForm`) that wraps `@tanstack/react-form` with Zod validation. This ensures consistent validation and error handling across forms.
- **Field Components**: Create reusable field components (TextField, SelectField, etc.) that integrate with the form hook's context. These should handle validation errors, accessibility, and consistent styling.
- **Validation Strategy**: Define Zod schemas for form validation, reusing them between client-side form validation and server-side tRPC input validation when possible.
- **Form State**: Leverage form hooks' built-in state management for submission states, field-level errors, and dirty tracking rather than managing these manually.

### Type Safety & Organization
- **Type Co-location**: Co-locate types with their consumers when they're specific to a feature. Use `src/types` for shared types used across multiple modules.
- **Inferred Types**: Leverage TypeScript's type inference from Zod schemas and tRPC routers. Export inferred types (e.g., `inferRouterInputs`, `inferRouterOutputs`) for use in components.
- **Type Exports**: Export types alongside their implementations. Use `export type` for type-only exports to enable better tree-shaking.

### Server/Client Boundaries
- **Server-Only Code**: Use `"server-only"` imports in server-side utilities to prevent accidental client bundling. Keep all database access, API keys, and sensitive logic in `src/server`.
- **RSC Patterns**: Use React Server Components by default. Mark client components with `"use client"` only when needed for interactivity, hooks, or browser APIs.
- **tRPC Integration**: Use separate tRPC clients for RSC (`src/trpc/server.ts`) and client components (`src/trpc/react.tsx`). Leverage `HydrateClient` for prefetching in RSC.

### Component Architecture
- **UI Primitives**: Keep base UI components in `src/components/ui/` as thin wrappers around headless UI libraries. These should be style-only, accepting standard props.
- **Feature Components**: Build feature-specific components in domain folders (e.g., `form/`, `navigation/`) that compose UI primitives with business logic.
- **Component Composition**: Prefer composition over configuration. Use render props, children patterns, and compound components for flexible APIs.

### Validation & Error Handling
- **Schema Organization**: Group related Zod schemas in domain-specific validation files (e.g., `src/lib/validations/adventure.ts`). Export both schemas and inferred types.
- **Reusable Validators**: Create reusable validation utilities (e.g., slug validation, email validation) that can be composed into larger schemas.
- **Error Messages**: Provide clear, user-friendly error messages in validation schemas. Consider extracting error message constants for consistency.
- **Client-Side Validation**: Validate on blur and submit. Show field-level errors immediately, but prevent submission until all validations pass.

### Custom Hooks Patterns
- **Hook Organization**: Place reusable hooks in `src/hooks/` with descriptive names (`use-debounce.ts`, `use-breakpoints.ts`). Co-locate feature-specific hooks with their components when they're not reusable.
- **Hook Composition**: Compose smaller hooks into larger ones. For example, a form submission hook might use debouncing, validation, and API mutation hooks.
- **Type Safety**: Type hook parameters and return values explicitly. Use generic types for hooks that work with multiple data types.

### Environment Variables
- **Type-Safe Env**: Use a library like `@t3-oss/env-nextjs` to validate environment variables at build time. Define separate schemas for server and client variables.
- **Env Organization**: Group related environment variables in the validation schema. Use descriptive names and provide helpful error messages for missing variables.

### Misc
- Always run `npm run check` after changes to ensure you didn't introduce any new errors