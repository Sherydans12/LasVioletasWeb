# Skill: Code Reviewer

## Purpose
Pre-commit quality checklist that every code change must pass before being committed.

## Checklist — Run Before Every Commit

### 1. Correctness
- [ ] Logic handles all edge cases (null, undefined, empty arrays, network failure)
- [ ] No hardcoded values that belong in constants or environment variables
- [ ] Async operations have error boundaries / try-catch
- [ ] No race conditions in concurrent state updates

### 2. TypeScript Hygiene
- [ ] No `any` types — use `unknown` + type guards if shape is unknown
- [ ] All props interfaces are explicitly typed (no implicit `{}`)
- [ ] Return types declared on exported functions
- [ ] Discriminated unions used for multi-state objects

### 3. React / Next.js Specifics
- [ ] No direct DOM manipulation (use refs only when necessary)
- [ ] `useEffect` dependencies array is complete and correct
- [ ] Server Components do not import client-only code
- [ ] `'use client'` directive present only where truly needed
- [ ] Images use `next/image` with explicit `width`/`height` or `fill`
- [ ] Links use `next/link` (never raw `<a>` for internal navigation)

### 4. Performance
- [ ] No unnecessary re-renders (check with React DevTools Profiler)
- [ ] Large lists use virtualization (`react-window` or `react-virtual`)
- [ ] Heavy imports are lazy-loaded with `dynamic()` or `React.lazy`
- [ ] No blocking operations on the main thread

### 5. Security
- [ ] No `dangerouslySetInnerHTML` without explicit sanitization
- [ ] Environment secrets never exposed in client bundle (`NEXT_PUBLIC_` prefix audit)
- [ ] User input is validated and sanitized before processing
- [ ] No vulnerable dependency versions (`npm audit`)

### 6. Accessibility (a11y)
- [ ] All interactive elements are keyboard-navigable
- [ ] Images have descriptive `alt` attributes
- [ ] Color contrast ratio ≥ 4.5:1 (WCAG AA)
- [ ] Focus indicators visible and styled
- [ ] ARIA roles used correctly (not redundantly)

### 7. Code Quality
- [ ] Functions under 40 lines; components under 150 lines
- [ ] No duplicated logic — abstracted into shared utilities
- [ ] Dead code removed (no commented-out blocks)
- [ ] Imports sorted: external → internal → types
- [ ] Consistent naming: PascalCase components, camelCase functions, SCREAMING_SNAKE constants

### 8. Testing
- [ ] New business logic has unit tests
- [ ] Critical user flows have integration/e2e coverage
- [ ] No `console.log` statements left in code

## Automated Enforcement
```json
// .eslintrc recommended rules
{
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/explicit-function-return-type": "warn",
  "react-hooks/exhaustive-deps": "error",
  "jsx-a11y/alt-text": "error",
  "no-console": "warn"
}
```
