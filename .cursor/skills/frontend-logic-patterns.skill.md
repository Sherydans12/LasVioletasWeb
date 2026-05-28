# Skill: Frontend Logic Patterns

## Purpose
Define composition rules and hook architecture for scalable, maintainable React/Next.js codebases.

## Hook Architecture Rules

### Naming Convention
- `use[Resource][Action]` — e.g., `useUserFetch`, `useFormSubmit`
- `use[Domain]State` — e.g., `useNavigationState`
- Never mix UI concerns inside data hooks.

### Separation of Concerns
```
Component (UI only) → Custom Hook (logic) → Service (API/data)
```
- **Components**: Render, handle user events, consume hooks.
- **Custom Hooks**: Encapsulate state, side-effects, derived values.
- **Services**: Pure async functions that communicate with external APIs.

### Custom Hook Template
```typescript
import { useState, useEffect, useCallback } from 'react'

interface UseResourceOptions {
  enabled?: boolean
}

interface UseResourceReturn<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function useResource<T>(
  fetcher: () => Promise<T>,
  options: UseResourceOptions = {}
): UseResourceReturn<T> {
  const { enabled = true } = options
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async () => {
    if (!enabled) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetcher()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setIsLoading(false)
    }
  }, [fetcher, enabled])

  useEffect(() => { execute() }, [execute])

  return { data, isLoading, error, refetch: execute }
}
```

## Composition Patterns

### Compound Components
Use when a parent component needs to share implicit state with children:
```typescript
// Context-based compound pattern
const TabsContext = createContext<TabsContextValue | null>(null)

function Tabs({ children, defaultValue }: TabsProps) { ... }
Tabs.List = TabsList
Tabs.Trigger = TabsTrigger
Tabs.Content = TabsContent
```

### Render Props (when hooks are insufficient)
```typescript
interface RenderProps<T> {
  data: T
  isLoading: boolean
  render: (props: { data: T; isLoading: boolean }) => React.ReactNode
}
```

### Container / Presentational Split
- `[Component]Container.tsx` — data fetching, business logic
- `[Component].tsx` — pure render, receives props only

## State Management Rules
- **Local UI state**: `useState` / `useReducer`
- **Cross-component**: React Context + `useContext`
- **Server state**: React Query or SWR (never Redux for server data)
- **Global client state**: Zustand (only when genuinely global)

## Performance Guards
- Memoize expensive computations with `useMemo`
- Stabilize callbacks passed to children with `useCallback`
- Use `React.memo` on pure presentational components
- Avoid inline object/array literals in JSX props
