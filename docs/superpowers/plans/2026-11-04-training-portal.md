# Training Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an original static Russian-language training portal that runs on GitHub Pages and stores anonymous visitor state only in a browser cookie.

**Architecture:** A Vite-built static HTML entry point loads a TypeScript application that renders hash-routed views into one root element. Focused modules own cookie serialization, route guards, static course content, and view rendering; CSS provides the responsive visual system. A GitHub Actions workflow deploys the checked `dist/` site.

**Tech Stack:** HTML, CSS, browser TypeScript, Vite, Vitest, Node.js, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-11-04-training-portal-design.md`

## Global Constraints

- No backend, database, API, analytics, third-party trackers, copied reference assets, or personal data.
- Cookie state may contain only anonymous nickname, session flag, course completion, test score, and survey choice; it expires after 30 days.
- The interface must explicitly describe the sign-in as a non-secure demonstration.
- The design must be original, Russian-language, responsive, and accessible by keyboard.
- Deploy only static output to GitHub Pages.

## Review Focus

- Malformed or stale cookie data must reset to a safe anonymous state instead of crashing the portal.
- A visitor cannot access a protected hash route without an active local session.
- An empty or overlong nickname must not be persisted.
- Completing a test twice must preserve the best score and keep progress within 0–100%.
- Narrow screens must retain navigation and actionable controls without horizontal overflow.

---

### Task 1: Project shell and anonymous state module

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `tests/state.test.ts`
- Create: `src/state.ts`
- Create: `src/types.ts`
- Create: `index.html`
- Create: `src/styles.css`

**Interfaces:**
- Produces `loadState(cookie: string): PortalState`, `saveState(state: PortalState): string`, `startSession(nickname: string): PortalState`, and `clearSession(): PortalState`.
- Produces the `PortalState` interface consumed by routing and views.

- [ ] **Step 1: Write failing state tests**

```ts
expect(loadState('portal_state=not-json').authenticated).toBe(false);
expect(startSession('   ' ).authenticated).toBe(false);
expect(startSession('Очень длинное имя пользователя больше тридцати двух символов').nickname.length).toBeLessThanOrEqual(32);
```

- [ ] **Step 2: Run the state test to verify it fails**

Run: `npm test -- state.test.ts`
Expected: FAIL because the state module does not exist.

- [ ] **Step 3: Implement cookie-safe anonymous state helpers and the minimal static project shell**

Configure Vite, Vitest, TypeScript, `npm test`, and `npm run typecheck`. Use a URL-encoded cookie value under one namespaced key and only the permitted `PortalState` fields. Add the responsive root HTML/CSS tokens, base layout, visible focus styles, and no external asset dependency.

- [ ] **Step 4: Run the state test to verify it passes**

Run: `npm test -- state.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json vite.config.ts tests/state.test.ts src/state.ts src/types.ts index.html src/styles.css
git commit -m "feat: add static portal shell and anonymous state"
```

### Task 2: Routing and original entry/dashboard views

**Files:**
- Create: `tests/router.test.ts`
- Create: `src/router.ts`
- Create: `src/content.ts`
- Create: `src/views.ts`
- Create: `src/main.ts`
- Modify: `index.html`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes `PortalState`, `loadState`, and `startSession` from Task 1.
- Produces `resolveRoute(hash: string, authenticated: boolean): Route` and `renderApp(root: HTMLElement, state: PortalState): void`.

- [ ] **Step 1: Write failing route tests**

```ts
expect(resolveRoute('#/courses', false)).toBe('entry');
expect(resolveRoute('#/dashboard', true)).toBe('dashboard');
expect(resolveRoute('#/unknown', true)).toBe('dashboard');
```

- [ ] **Step 2: Run the route test to verify it fails**

Run: `npm test -- router.test.ts`
Expected: FAIL because the router module does not exist.

- [ ] **Step 3: Implement route guards, entry, and dashboard rendering**

Render an original dark-ink/red portal design with a demonstration sign-in card, optional nickname, guest entry, local-only data notice, dashboard progress card, current course, and quick actions. Attach hash navigation and session changes in `main.ts`.

- [ ] **Step 4: Run the route test to verify it passes**

Run: `npm test -- router.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tests/router.test.ts src/router.ts src/content.ts src/views.ts src/main.ts index.html src/styles.css
git commit -m "feat: add guarded entry and dashboard views"
```

### Task 3: Courses, test, survey, and results interactions

**Files:**
- Create: `tests/progress.test.ts`
- Create: `src/progress.ts`
- Modify: `src/content.ts`
- Modify: `src/types.ts`
- Modify: `src/views.ts`
- Modify: `src/main.ts`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes `PortalState` from Task 1 and render contracts from Task 2.
- Produces `completeCourse(state: PortalState, courseId: string): PortalState` and `recordTestScore(state: PortalState, score: number): PortalState`.

- [ ] **Step 1: Write failing progress tests**

```ts
expect(recordTestScore(startSession('Гость'), 40).testScore).toBe(40);
expect(recordTestScore(recordTestScore(startSession('Гость'), 80), 40).testScore).toBe(80);
expect(completeCourse(startSession('Гость'), 'service-basics').completedCourseIds).toContain('service-basics');
```

- [ ] **Step 2: Run the progress test to verify it fails**

Run: `npm test -- progress.test.ts`
Expected: FAIL because the progress module does not exist.

- [ ] **Step 3: Implement learning interactions**

Add hard-coded anonymous learning content, a filterable course-card grid, course completion actions, a short multi-choice test with immediate result, one anonymous survey choice, and a profile/results view. Persist each permitted change with the Task 1 cookie helper.

- [ ] **Step 4: Run the progress test to verify it passes**

Run: `npm test -- progress.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tests/progress.test.ts src/progress.ts src/content.ts src/types.ts src/views.ts src/main.ts src/styles.css
git commit -m "feat: add courses tests survey and results"
```

### Task 4: Build validation and GitHub Pages deployment

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`
- Modify: `package.json`

**Interfaces:**
- Consumes the static `index.html` and `src/` source structure from Tasks 1–3.
- Produces `npm test`, `npm run typecheck`, `npm run build`, and a GitHub Pages deployment workflow.

- [ ] **Step 1: Configure validation, documentation, and deployment**

This task changes build/deployment configuration rather than product behavior, so it uses direct validation rather than a unit test. Add an `npm run build` Vite script, document local preview and the GitHub Pages setup step, and add a least-privilege Pages workflow that builds and deploys `dist/` using the official upload/deploy actions.

- [ ] **Step 2: Run final verification**

Run: `npm test && npm run typecheck && npm run build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml README.md package.json
git commit -m "chore: add validation and GitHub Pages deployment"
```
