# Skill: Find Skills (Auto-Discovery Protocol)

## Purpose
Analyze the current project context and automatically identify missing skills that would improve development quality, velocity, or coverage.

## Trigger Conditions
Execute this skill when:
- Starting a new project phase
- A new technology is introduced to the stack
- A recurring problem appears that could be systematized
- Code review reveals a pattern gap
- Performance or SEO audits surface systematic issues

## Discovery Algorithm

### Step 1 — Map Current Skills
Enumerate all files in `.cursor/skills/`:
```
frontend-logic-patterns.skill.md  → React/Next.js patterns
code-reviewer.skill.md             → Pre-commit quality gate
git-commit-writer.skill.md         → Commit message standard
readme-generator.skill.md          → Documentation automation
ui-ux-pro-max.skill.md             → Design system rules
find-skills.skill.md               → This file (meta)
seo-optimization.skill.md          → SEO strategies
image-optimization.skill.md        → Image pipeline
```

### Step 2 — Analyze Project Needs
For each domain below, evaluate if a dedicated skill is missing:

| Domain                  | Check                                           |
|-------------------------|-------------------------------------------------|
| Performance             | Lighthouse scores tracked? Bundle analyzed?     |
| SEO                     | Metadata, structured data, sitemaps covered?    |
| Accessibility           | WCAG audit process defined?                     |
| Testing                 | Unit, integration, e2e strategy documented?     |
| Deployment              | CI/CD pipeline, env promotion defined?          |
| Internationalization    | i18n strategy if multilingual needed?           |
| Analytics               | Event tracking schema defined?                  |
| Error Monitoring        | Sentry / error boundary strategy?               |
| Design Tokens           | Color, spacing, typography system centralized?  |
| API Integration         | Request/response contracts typed and versioned? |
| Security                | CSP headers, OWASP checklist?                   |
| State Management        | Global state boundaries defined?                |

### Step 3 — Gap Report Format
```markdown
## Skills Gap Report — [Date]

### Project: Las Violetas Web
### Phase: [current phase]

#### Missing Skills Identified
| Priority | Skill Name                    | Reason                                    |
|----------|-------------------------------|-------------------------------------------|
| HIGH     | seo-optimization.skill.md     | Institutional site needs structured data  |
| HIGH     | image-optimization.skill.md   | Performance target > 95 Lighthouse        |
| MEDIUM   | testing-strategy.skill.md     | No test coverage standards defined        |
| LOW      | analytics-schema.skill.md     | Future GA4 integration                    |

#### Action
For each HIGH priority gap: create the skill file immediately.
For MEDIUM/LOW: log in project backlog.
```

### Step 4 — Skill Creation Checklist
When creating a new skill discovered by this process:
- [ ] Filename: `[domain]-[focus].skill.md` (kebab-case)
- [ ] Section: Purpose, Rules/Patterns, Examples, Checklist
- [ ] Cross-reference existing skills that overlap
- [ ] Update this file's Step 1 map

## Continuous Improvement
Re-run this skill:
- After every major feature addition
- When onboarding a new team member
- Before any production deployment
- When Lighthouse score drops below 90
