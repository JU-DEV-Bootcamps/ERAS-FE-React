---
name: eras-fe-react-feature
description: Implements one FE-React task of an approved ERAS change in ERAS v3 (ERAS-FE-React) along the golden path of AGENTS.md §7.1 - route and roles, feature folder, API calls through src/core/http, TanStack Query, permissions with canAccess, texts in three languages. Use when /sdd-implement reaches an implementation task for the FE-React side, after that task's AC test exists and fails. Writes only the code the task names, stops on decisions an ADR has not taken yet, and never commits.
---

Make the failing AC test of one FE-React task pass with the smallest code that follows `AGENTS.md` §7.1 and §7.2
of this repository. The test comes first, from `eras-fe-react-test`; this skill writes the code under test.

**Boundary.** Only the files the task needs under `src/`, plus the three text resources. No new dependency unless
the task names it, and then pinned (`.npmrc` has `save-exact=true`). Do not edit the spec, `design.md` or the
test's assertions, and do not commit.

## Stop and ask (decisions no ADR has taken yet)

Stop and tell the user which ADR is missing, instead of choosing yourself, when the task needs:

- **A global store or a new layer** beyond the table in §4.2: ADR-0015 rules both out, so a need for one is a
  new ADR, not a choice of this task.
- **A UI library or styling system other than MUI** and its theme (ADR-0016).
- **A code generator** for API calls (ADR-0014 rules it out): API code is written by hand as in §7.1 step 2.
- **A form** for the first time: React Hook Form is the stack (ADR-0012), but it is not installed. The first
  change that needs a form installs it, so check that the task says so.

## Steps

1. **Read the task and its AC.** Read the task line in `tasks.md`, the scenario it cites
   (`openspec/changes/<change-id>/specs/**/spec.md` in the parent repository), the D-block of `design.md`, and
   the failing test. Implement only what that AC needs.
2. **Route** (only when the task adds a screen). Add one entry to `appRoutes` in `src/app/routing/routes.tsx`:
   `{ path, element: <XPage />, roles: [...] }`, with the role keys `administrator`, `officer` and
   `professional` taken **from the spec's ACs**. An empty list opens the route to every signed-in user.
   `RoleGuard` (`src/app/routing/RoleGuard.tsx`) already applies the rules, so do not repeat them in the page.
3. **Feature folder** `src/features/<feature>/` (kebab-case folder, one per ERAS module):
   - Page and components: one component per file, named after it in PascalCase (`StudentListPage.tsx`).
     Use function components with a **named export** and props typed with an `interface`.
   - Other modules in lower case (`api.ts`, `use-students.ts`).
   - Import from `shared`, `core` and `app/session` only, **never from another feature**.
4. **Server state.** Read and change server data with `useQuery` / `useMutation` in hooks of the feature
   folder. Components never keep a copy of server data in `useState`. Calls go only through the HTTP client
   (see "Stop and ask"). The lint rules forbid `axios` and `fetch` outside `src/core/`.
5. **Permissions in the UI.** Read the user from `useSession()` (`src/app/session.tsx`) and decide with
   `canAccess(session.roles, ['officer'], session.roleNames)` from `src/core/auth/access.ts`. Never compare
   raw role strings.
6. **Texts.** No user-facing text in a component. Add the keys with `eras-fe-react-i18n` and show them with
   `const { t } = useTranslation();`.
7. **Accessibility.** Real `<button>` and `<a>` elements, a `<label>` for every input, headings in order. The
   jsx-a11y rules are errors.
8. **Run the test** of the task until it passes: `npm test -- run <path of the test file>`. Then run the tests
   of the folder you touched: `npm test -- run src/features/<feature>`.
9. **Gates.** Run `npm run lint`, `npm run typecheck`, `npm run test:ci` (at least 15% of lines) and
   `npm run build`. A lint error that cites `AGENTS.md` names the rule to follow. Fix the code; never suppress
   the rule.

## Report

The files created or changed, the test that now passes, and the four gate results as printed. Then name anything
you stopped on and the ADR it waits for.
