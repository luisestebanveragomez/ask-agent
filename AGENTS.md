# Agent Guidelines for ask-agent

This document provides comprehensive guidelines for agentic coding assistants working in this repository.

## Project Overview

This is a React TypeScript application built with:

- **Framework**: Vite + React 19 + TanStack Start
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Language**: TypeScript with strict mode
- **Testing**: Vitest
- **Linting**: ESLint with TanStack config
- **Formatting**: Prettier

## Build Commands

### Development

```bash
npm run dev          # Start development server on port 3000
```

### Building & Testing

```bash
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run all tests with Vitest
npm run lint         # Run ESLint
npm run format       # Check formatting with Prettier
npm run check        # Format code and fix linting issues
```

### Running Individual Tests

Since this project uses Vitest, you can run specific tests:

```bash
npx vitest run path/to/test.test.ts    # Run specific test file
npx vitest run --grep "test name"      # Run tests matching pattern
npx vitest watch                       # Run tests in watch mode
```

## Code Style Guidelines

### Import Organization

- Use ES6 imports exclusively
- Import order is not enforced (eslint import/order is disabled)
- Use TypeScript import extensions where needed
- Prefer named imports over default imports when possible

### Formatting Rules (Prettier)

```javascript
{
  semi: false,           // No semicolons
  singleQuote: true,     // Use single quotes
  trailingComma: "all",  // Trailing commas everywhere
}
```

### TypeScript Guidelines

- **Strict Mode**: Enabled with additional strict checks
- **Target**: ES2022 with DOM types
- **Module Resolution**: Bundler mode
- **Unused Variables/Parameters**: Not allowed
- **Array Types**: Either `T[]` or `Array<T>` (no enforcement)
- **Async Functions**: `require-await` rule is disabled

### Path Mapping

Use the configured path aliases:

- `@/*` maps to `./src/*`
- `#/*` maps to `./src/*` (package.json imports)

### Naming Conventions

Based on codebase analysis:

- **Files**: kebab-case for regular files, PascalCase for components
- **Functions**: camelCase
- **Components**: PascalCase
- **Hooks**: camelCase starting with "use" prefix
- **Types/Interfaces**: PascalCase
- **Constants**: SCREAMING_SNAKE_CASE or camelCase

### Component Structure

```typescript
// Example component structure
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ComponentProps {
  className?: string
  // other props
}

export function Component({ className, ...props }: ComponentProps) {
  const [state, setState] = useState(false)

  return (
    <div className={cn('base-classes', className)}>
      {/* component content */}
    </div>
  )
}
```

### Hook Structure

```typescript
// Example custom hook
import { useCallback, useState } from 'react'

export function useCustomHook() {
  const [state, setState] = useState(false)

  const action = useCallback(() => {
    // hook logic
  }, [])

  return { state, action }
}
```

### Error Handling

- Use proper TypeScript error types
- Implement proper try-catch blocks for async operations
- Use Result pattern or proper error boundaries for React components
- Log errors appropriately but avoid console.log in production

### API Route Structure

```typescript
// Example API route (TanStack Start)
import { createAPIFileRoute } from '@tanstack/react-start/api'

export const Route = createAPIFileRoute('/api/endpoint')({
  POST: async ({ request }) => {
    try {
      const data = await request.json()
      // handle request
      return Response.json({ success: true })
    } catch (error) {
      return Response.json({ error: 'Error message' }, { status: 500 })
    }
  },
})
```

## Disabled ESLint Rules

The following rules are intentionally disabled:

- `import/no-cycle` - Circular imports allowed
- `import/order` - No import ordering enforcement
- `sort-imports` - No import sorting
- `@typescript-eslint/array-type` - Flexible array syntax
- `@typescript-eslint/require-await` - Async without await allowed
- `pnpm/json-enforce-catalog` - Package catalog not enforced

## shadcn/ui Integration

This project uses shadcn/ui components. When adding new components:

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add dialog
# etc.
```

Components are configured in `components.json` and use Tailwind CSS for styling.

## Testing Guidelines

- Tests should be written in TypeScript
- Use `@testing-library/react` for component testing
- Use `@testing-library/dom` for DOM utilities
- Follow the Testing Library best practices (query by role, text, etc.)
- Mock external dependencies appropriately

## File Organization

```
src/
├── components/     # Reusable UI components
├── data/          # Static data and mock data
├── hooks/         # Custom React hooks
├── integrations/  # External service integrations
├── lib/           # Utility libraries and configurations
├── routes/        # TanStack Router pages and API routes
├── utils/         # Pure utility functions
└── styles.css     # Global styles
```

## Dependencies Notes

- Uses latest TanStack ecosystem (Router, Query, AI)
- React 19 with concurrent features
- Tailwind CSS v4 (latest)
- Zod for runtime validation
- Highlight.js for syntax highlighting
- Marked for markdown processing

## Performance Considerations

- Use React 19 features like concurrent rendering
- Implement proper code splitting with TanStack Router
- Optimize bundle size by checking imports
- Use TanStack Query for data fetching and caching
- Implement proper error boundaries

## Development Workflow

1. Start development server: `npm run dev`
2. Make changes following the style guidelines above
3. Run linting and formatting: `npm run check`
4. Run tests: `npm test`
5. Build to verify: `npm run build`

Remember to follow the existing patterns in the codebase and maintain consistency with the established architecture.