# Skill: Git Commit Writer

## Purpose
Enforce Conventional Commits standard for a clean, machine-readable git history.

## Format
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

## Types
| Type       | When to use                                          |
|------------|------------------------------------------------------|
| `feat`     | New feature for the user                             |
| `fix`      | Bug fix                                              |
| `docs`     | Documentation only changes                          |
| `style`    | Formatting, missing semi-colons (no logic change)   |
| `refactor` | Code change that neither fixes a bug nor adds feature|
| `perf`     | Performance improvement                              |
| `test`     | Adding or correcting tests                           |
| `build`    | Changes to build system or dependencies              |
| `ci`       | CI/CD configuration changes                         |
| `chore`    | Maintenance tasks, tooling                           |
| `revert`   | Reverting a previous commit                          |

## Scopes (Las Violetas Web)
| Scope        | Area                                       |
|--------------|--------------------------------------------|
| `layout`     | Root layout, navigation, footer            |
| `home`       | Homepage section                           |
| `seo`        | Metadata, Open Graph, structured data      |
| `ui`         | Shared UI components                       |
| `services`   | API service layer                          |
| `config`     | Next.js, Tailwind, ESLint config files     |
| `skills`     | .cursor/skills files                       |
| `a11y`       | Accessibility improvements                 |
| `perf`       | Performance optimizations                  |
| `deps`       | Dependency updates                         |

## Rules
1. **Description**: imperative mood, present tense, lowercase, no period at end
   - ✅ `feat(home): add hero section with CTA button`
   - ❌ `feat(home): Added Hero Section.`
2. **Subject line**: max 72 characters
3. **Body**: explain WHY, not what. Wrap at 72 chars. Separate from subject with blank line.
4. **Breaking changes**: add `!` after scope and `BREAKING CHANGE:` footer
   ```
   feat(services)!: migrate to v2 API endpoint

   BREAKING CHANGE: removed /api/v1/contact endpoint
   ```
5. **Reference issues**: footer `Closes #123` or `Refs #456`

## Examples

```
feat(layout): add sticky navigation with blur backdrop

Implements intersection observer for transparent-to-frosted transition
as user scrolls past the hero section threshold.
```

```
fix(seo): correct Open Graph image dimensions for Twitter Card

Twitter requires 1200x630 minimum; previous values were 800x400
causing fallback to default image on shares.
```

```
perf(home): lazy-load below-fold sections with dynamic imports

Reduces initial bundle by ~34kB. Sections use Suspense boundaries
with skeleton placeholders matching final layout dimensions.
```

```
build(deps): upgrade framer-motion to 11.x

Enables scroll-driven animations via useScroll without polyfills.
```

## Git Workflow
```bash
# Stage specific files (never git add -A blindly)
git add src/components/Hero.tsx src/app/page.tsx

# Commit with conventional format
git commit -m "feat(home): add hero section with animated headline"

# If body needed, use editor
git commit  # opens $EDITOR
```
