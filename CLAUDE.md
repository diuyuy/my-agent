# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application with a Hono API backend that implements an AI-powered conversation system. The project uses:
- **Frontend**: Next.js 16 with React 19, App Router, and Tailwind CSS v4
- **Backend API**: Hono framework with OpenAPI/Zod validation, served via Next.js API routes
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: Vercel AI SDK with Google Gemini and OpenAI providers
- **Auth**: Better-Auth with GitHub OAuth
- **UI Library**: Radix UI primitives with shadcn/ui patterns
- **Styling**: Tailwind CSS v4, next-themes for dark mode, class-variance-authority for component variants
- **Icons**: Lucide React
- **Notifications**: Sonner for toast notifications
- **Package Manager**: pnpm (v10.26.2)

## Common Commands

### Development
```bash
pnpm dev              # Start Next.js dev server (default: http://localhost:3000)
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
```

### Database Operations
```bash
npx drizzle-kit generate  # Generate migrations from schema
npx drizzle-kit migrate   # Run migrations
npx drizzle-kit push      # Push schema changes directly to DB
npx drizzle-kit studio    # Open Drizzle Studio for DB inspection
```

Note: Database migrations are generated from `src/db/schema/*` files.

## Architecture

### API Architecture (Hono + Next.js Hybrid)

The API is built with Hono framework but served through Next.js API routes:

1. **Entry Point**: `src/app/api/[[...route]]/route.ts`
   - All API requests are routed through this catch-all Next.js route
   - Hono app is instantiated with OpenAPIHono for automatic OpenAPI documentation
   - Base path: `/api`

2. **Hono Setup**:
   - Uses `@hono/zod-openapi` for request/response validation
   - Global error handling via `globalExceptionHandler`
   - Default validation hook: `zodValidationHook`
   - API documentation available at `/api/doc` (OpenAPI spec) and `/api/scalar` (Scalar UI)

3. **Feature-Based Routing**:
   - Routes are organized by feature in `src/server/features/`
   - Each feature has: `*.route.ts`, `*.service.ts`, and `*.schemas.ts` for Zod validation schemas
   - Routes are registered to the main Hono app (e.g., `app.route("/conversations", conversationRoute)`)
   - Schemas define both request/response validation and TypeScript types

4. **Authentication Flow**:
   - Better-Auth handles `/api/auth/*` routes directly via `auth.handler()`
   - Session validation happens in `sessionMiddleware` for protected routes
   - User context is injected into Hono context via `c.set("user", session.user)`

### Database Schema Organization

Located in `src/db/schema/`:
- `auth-schema.ts` - Better-Auth tables (user, session, account, verification)
- `schema.ts` - Application tables (conversations, messages, tool_invocations, document_chunks, favorite_conversations)
- `enums.ts` - PostgreSQL enums (messageRoleEnum, fileTypeEnum)

Key relationships:
- `conversations` → `messages` (one-to-many)
- `conversations` → `favorite_conversations` (one-to-many)
- `messages` → `message_attachments`, `tool_invocations` (one-to-many)
- `user` → `conversations`, `document_chunks`, `favorite_conversations` (one-to-many)
- `document_chunks` includes vector embeddings (1536 dimensions) with HNSW index for similarity search

Notable schema features:
- Messages use a `parts` array structure (following AI SDK's UIMessage format) for multi-part content
- Messages include `metadata` JSONB field typed to `MyUIMessage["metadata"]` for conversation and model tracking
- Favorite conversations use unique constraint on (userId, conversationId) to prevent duplicates

### AI Integration

The AI functionality is in `src/server/features/ai/`:
- **Core Library**: Vercel AI SDK (`ai` package) with streaming support
- **Primary Model**: Google Gemini 2.5 Flash (`google("gemini-2.5-flash")`)
- **Embeddings**: OpenAI text-embedding-3-small (1536 dimensions)
- **Message Types**:
  - Messages follow the `UIMessage` type from AI SDK with custom metadata
  - `MyUIMessage` type defined in `ai.schemas.ts` extends `UIMessage<MyMetadataPart>`
  - Custom metadata schema (`metadataPart`) includes: `conversationId` (UUID), `modelProvider` (string)
- **Client Integration**: `@ai-sdk/react` provides React hooks for AI streaming (e.g., `useChat`)

### Authentication & Middleware

- **Auth Provider**: Better-Auth with GitHub OAuth
- **Middleware Chain**:
  1. Next.js middleware (`src/proxy.ts`) redirects unauthenticated users to `/login`
  2. Hono's `sessionMiddleware` validates sessions for API routes
- **Protected Routes**: All routes except `/api/*`, `/login`, `/_next/*`, and static assets require authentication

### Frontend Structure

- **App Router**: `src/app/` follows Next.js 16 App Router conventions
- **Route Groups**:
  - `(main)/` - Main application layout with sidebar
    - `/chat` - AI chat interface with prompt input
    - `/workspaces` - Workspace management
- **Pages**: `/login`, `/tests`
- **API Routes**: Handled by Hono via `[[...route]]` catch-all
- **UI Components**: Located in `src/components/ui/` (shadcn/ui pattern with Radix UI):
  - Layout: `sidebar`, `sheet`, `scroll-area`, `separator`
  - Forms: `input`, `label`, `select`, `field`
  - Feedback: `dialog`, `alert-dialog`, `tooltip`, `sonner` (toasts), `spinner`, `skeleton`
  - Data Display: `card`, `avatar`, `accordion`
  - Interactive: `button`, `dropdown-menu`
- **App Components**:
  - `app-sidebar.tsx` - Application sidebar navigation component
- **Hooks**: Custom hooks in `src/hooks/` (e.g., `use-mobile.ts` for responsive design)
- **Auth Client**: `src/lib/auth-client.ts` for client-side auth operations

### Common Utilities

Located in `src/server/common/`:
- `errors/` - Custom exception classes and global error handler
- `middlewares/` - Reusable Hono middlewares (session validation)
- `utils/` - Response helpers, validation hooks, cursor pagination
- `types/` - Shared TypeScript types and Hono environment interface

### Path Aliases

TypeScript paths configured in `tsconfig.json`:
- `@/*` → `./src/*`

Use absolute imports throughout the project (e.g., `@/lib/auth` instead of `../../lib/auth`).

## Environment Variables

Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `GITHUB_CLIENT_ID` - GitHub OAuth app client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth app secret
- AI provider keys (OpenAI API key for embeddings, Google AI for Gemini)

## Important Notes

1. **OpenAPI Documentation**: Routes can be registered via `createRoute()` helper or `.openAPIRegistry.registerPath()`. The former is preferred for full type safety.

2. **Validation**: All request validation uses Zod v4 schemas. Define schemas in feature-specific files (e.g., `src/server/features/ai/ai.schemas.ts`) and reuse across routes and services.

3. **Response Format**: Use `createSuccessResponse()` utility from `response-utils.ts` for consistent API responses.

4. **Database Queries**: All database operations should use Drizzle ORM. Import `db` from `@/db/db`.

5. **Streaming Responses**: AI streaming uses Vercel AI SDK's `streamText()`. The route at `POST /conversations` is configured for text/event-stream responses.

6. **Error Handling**: Throw `CommonHttpException` with appropriate `RESPONSE_STATUS` constants for consistent error responses.
