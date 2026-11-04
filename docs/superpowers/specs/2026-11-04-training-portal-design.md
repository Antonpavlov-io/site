# Training Portal — Design

## Intent

Create a static, Russian-language training portal inspired by the structure of the existing NTS portal, but with an original responsive visual design. It is a demonstrator for training materials: visitors can enter a nickname, browse courses, complete a short test, leave an anonymous rating, and see locally calculated progress.

## Goals

- Publish on GitHub Pages with no server, database, or external runtime dependency.
- Provide five client-side views: sign-in, dashboard, course catalog, test, and profile/results.
- Keep the visual language distinct from the reference: dark ink base, warm red accent, spacious cards, responsive layouts, and original typography and illustrations built from CSS/icons.
- Preserve state only on the visitor's device: anonymous nickname, session flag, course completion, test score, and survey choice.

## Non-goals

- No real authentication, credential validation, access control, user records, or user-to-user data.
- No collection or storage of personal data, including real names, e-mail addresses, phone numbers, photos, or passwords.
- No backend, database, API, analytics, third-party trackers, or copied source/assets from the reference site.

## Approaches

1. Static HTML, CSS, and TypeScript with a small client-side router — selected. It is fast to load, needs no framework runtime, and maps cleanly to GitHub Pages.
2. React with a bundler — rejected for the initial release because the portal's state and page count do not justify the extra tooling.
3. Separate static HTML pages — rejected because it duplicates navigation and makes the shared state flow more brittle.

## Technical Design

- `index.html` is the GitHub Pages entry point; TypeScript renders the active view based on the URL hash.
- CSS uses custom properties, responsive grid/flex layouts, and accessible focus states. The visual design uses original abstract rail/service illustrations and inline SVG icons.
- A lightweight cookie helper writes a single URL-encoded JSON value under a namespaced key. It includes only anonymous UI state and expires after 30 days. A reset/logout control deletes it.
- The sign-in page asks for an optional display nickname, limited to a short safe string. It labels the experience as a demonstration and explains that it is not a secure account.
- The application starts with curated, hard-coded course/test/survey metadata. No form value is sent anywhere.

## Information Architecture

- **Entry:** brand statement, anonymous demonstration sign-in, privacy explanation, and an illustrated feature panel.
- **Dashboard:** welcome banner, total progress, current course, quick links, and small activity widgets.
- **Courses:** filterable course-card grid with category, duration, learning progress, and an action to mark a lesson completed.
- **Test:** one short multi-choice training assessment, immediate feedback, score calculation, and progress update.
- **Pulse survey:** a compact anonymous satisfaction rating stored only in the same browser cookie.
- **Profile/results:** nickname, progress summary, recent achievements, cookie-reset/logout control, and an explicit "stored on this device only" note.

## Interaction and State

1. On first visit, show Entry.
2. After the visitor confirms a nickname or chooses the guest option, save the anonymous session cookie and navigate to Dashboard.
3. Course actions and test completion update the cookie and immediately re-render progress widgets.
4. Logout/reset deletes the cookie and returns to Entry.
5. Direct navigation to a protected hash view without a cookie redirects to Entry.

## Validation and Deployment

- Use the TypeScript compiler in no-emit checking mode and a static local preview for manual responsive checks.
- Include a GitHub Actions workflow that deploys the repository's static output to GitHub Pages on pushes to the default branch.
- The first repository push and enabling GitHub Pages remain user-controlled because this agent's terminal cannot access the user's macOS Keychain-backed GitHub credential.
