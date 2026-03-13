---
trigger: always_on
---

# Project Instructions

## 1. Purpose

This document defines **coding standards, architectural rules, and AI behavior constraints** for this repository.
All AI tools, AI Agent **must follow these rules strictly**.

Deviation = technical debt.

---

## 2. Tech Stack (Non-Negotiable)

* **Framework:** Next.js (latest stable, App Router)
* **Language:** TypeScript
* **Package Manager:** NPM (no yarn, no pnpm)
* **Styling:** Modern UI (Tailwind CSS or equivalent utility-first approach)
* **Runtime:** Node.js (LTS)
* **Rendering:** Server Components by default, Client Components only when required

---

## 3. Naming Conventions (Strict)

### Variables & Functions

* **camelCase**

```ts
const userProfile
function fetchUserData()
```

### Files & Components

* **PascalCase**

```txt
UserCard.tsx
AuthProvider.tsx
DashboardLayout.tsx
```

### Folders

* **camelCase**

```txt
components/
authHandlers/
apiRoutes/
```

### Constants

* **UPPER_SNAKE_CASE**

```ts
const MAX_RETRY_COUNT = 3
```

---

## 4. Project Structure Guidelines

```txt
src/
 ├─ app/                # Next.js App Router
 ├─ components/         # Reusable UI components
 ├─ hooks/              # Custom React hooks
 ├─ lib/                # Utilities & helpers
 ├─ services/           # Business logic & API calls
 ├─ styles/             # Global styles
 └─ types/              # Shared TypeScript types
```

Rules:

* No logic inside UI components unless trivial
* No direct API calls inside JSX
* Shared logic lives in `services/` or `lib/`

---

## 5. Coding Rules

* TypeScript **must be strict**
* Avoid `any` unless justified
* Prefer **async/await** over `.then()`
* No inline magic numbers
* No duplicated logic
* Write self-documenting code, not comments as excuses

Bad:

```ts
// this works trust me
```

Good:

```ts
const sessionExpirationTimeMs = 1000 * 60 * 60
```

---

## 6. Styling Rules

* Use **utility-first CSS**
* No inline styles unless absolutely required
* Responsive by default (mobile-first)
* Dark mode compatible
* Consistent spacing & typography

---

## 7. AI Agent Instructions

AI Agent **must**:

* Follow all naming conventions above
* Generate **TypeScript-first** code
* Prefer Next.js best practices
* Avoid legacy Pages Router
* Avoid deprecated APIs
* Never introduce unused imports
* Never mix CommonJS with ES Modules

Ai Agent **must not**:

* Add random dependencies
* Invent project structure
* Use JavaScript when TypeScript is expected
* Ignore existing patterns

---

## 8. Quality Bar

Every contribution must:

* Be readable in 6 months
* Be understandable without explanations
* Be safe to extend
* Be production-ready

If it’s clever but unclear — **rewrite it**.

---

## 9. Final Rule

Consistency > cleverness
Clarity > shortcuts
Standards > personal preference

No exceptions.
