# AGENTS.md — ERAS Frontend v3 (`ERAS-FE-React/`)

Rules of ERAS v3, the React web client. The shared rules (core principles §1.1, conventions §5, cross-cutting contracts §4.3, workflow §8, limits §9) live in the root `AGENTS.md` of the ERAS parent repository and apply in full here too. Section numbers in this file are the same as in the root file, so "`AGENTS.md` §7.1" means this file. A rule lives in exactly one file (ADR-0007 in `openspec/adr/` of the parent repository). The v2 client (Angular) has its own rules in the `AGENTS.md` of `ERAS-FE`, and the backend in the one of `ERAS-BE`. In the parent's `openspec/sides.conf` this repository is the side `FE-React` (ADR-0011); its stack is ADR-0012 and its login ADR-0013.

Commands below are written from the parent repository root; when you are already inside `ERAS-FE-React/`, skip the `cd ERAS-FE-React` line.

---

## 3. Commands

### 3.3 Frontend v3 (`ERAS-FE-React/`)

```bash
cd ERAS-FE-React
npm ci                                   # Node version in .nvmrc
npm run dev                              # http://localhost:5173, /api proxied to the backend on :8080
npm run lint                             # ESLint (typescript-eslint strict, react-hooks, jsx-a11y, Prettier)   ← gate
npm run format                           # rewrite every file with Prettier (.prettierrc.json, as ERAS-FE)
npm run typecheck                        # tsc --noEmit                                               ← gate
npm run test:ci                          # all tests once, with coverage (fails under 15% of lines)   ← gate
npm run build                            # production build in dist/                                  ← gate
npm test                                 # Vitest in watch mode
npm test -- run src/features/<feature>   # the tests of one folder, once
```

`npm test` and `npm run test:ci` start Vitest through `scripts/vitest.mjs`, which fixes a Windows-only problem with a lower-case drive letter in the working directory. Run them through npm, not with `npx vitest`.

The runtime configuration is `public/config.json` (Keycloak URL, realm, client id, roles resource, role names). Its committed values are the local ones; each environment mounts its own file.

**Local Keycloak client.** The parent's `Keycloak/realm-export.json` defines the client `eras-fe-react`, but Keycloak imports that file only when the realm `ERAS` does not exist yet in its data volume. If your local Keycloak (`http://localhost:18080`) already had the realm, create the client by hand, in realm `ERAS` → Clients, with exactly these values; a missing or different web origin makes the login end in "ERAS could not start: Failed to fetch" (Keycloak answers `403 Invalid origin` to the token request):

| Setting                                                       | Value                                                                                                                                        |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Client ID                                                     | `eras-fe-react`                                                                                                                              |
| Client authentication                                         | Off (public client)                                                                                                                          |
| Authentication flow                                           | Standard flow only (no direct access grants, no implicit flow)                                                                               |
| Valid redirect URIs                                           | `http://localhost:5173/*`                                                                                                                    |
| Valid post logout redirect URIs                               | `http://localhost:5173/*`                                                                                                                    |
| Web origins                                                   | `http://localhost:5173` (no trailing slash, no `/*`)                                                                                         |
| Advanced → Proof Key for Code Exchange Code Challenge Method  | `S256`                                                                                                                                       |
| Client scopes → `eras-fe-react-dedicated` → mapper "Audience" | Included client audience `api-client`, added to the access token (the audience the backend validates; without it every API call answers 401) |

The roles come from the roles of the client `public-client` that the seed users already have; the client needs no roles of its own. The seed users and their passwords are in the same `realm-export.json`.

---

## 4. Architecture

### 4.2 Frontend v3 — React 19 (`ERAS-FE-React/`)

| Layer     | Path                                   | Owns                                                                                                                                                                           |
| --------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Bootstrap | `src/main.tsx`, `src/app/`             | Start order (configuration, login, texts, render), providers (`AppProviders`), the session context, the route table (`routing/routes.tsx`) and its role guard, the shell pages |
| Core      | `src/core/`                            | Singletons without UI: runtime configuration (`config/`), login and roles (`auth/`), the HTTP client (`http/`), texts (`i18n/`)                                                |
| Features  | `src/features/<feature>/`              | One folder per ERAS module: its pages, components, hooks and API calls (created by the module's change)                                                                        |
| Shared    | `src/shared/`                          | Reusable pieces used by two or more features (created when the second feature needs one)                                                                                       |
| Tests     | next to each unit, `src/test/setup.ts` | `*.test.ts` / `*.test.tsx`; the setup file registers the jest-dom matchers and cleans up after each test                                                                       |

Dependencies point inward: `features` may use `shared`, `core` and `app/session`; `core` uses nothing from `app` or `features`; a feature never imports another feature. ADR-0016 (state and layers) will make this structure final before the first module.

---

## 7. Frontend

### 7.1 Golden path for a new frontend feature

1. **Route.** Add one entry per screen to `appRoutes` in `src/app/routing/routes.tsx` with its `path`, its `element` and its `roles` (role keys `administrator`, `officer`, `professional`; an empty list opens it to every signed-in user). The role guard applies the role rules of the parent's §4.3 and sends anyone else to "access denied". The roles come from the spec's ACs.
2. **API.** Call the backend only through the client of `src/core/http/` (base `/api/v1`, bearer token added for you). Never build an absolute URL and never call `fetch` or `axios` directly from a component. The client generated from the backend's OpenAPI document and its adapters are decided by ADR-0015 before the first module.
3. **Server state.** Read and change server data with TanStack Query hooks (`useQuery`, `useMutation`) in the feature folder; components do not keep copies of server data in their own state.
4. **Component.** Function components and hooks only. Keep a component's props typed with an `interface`; no default exports.
5. **Forms.** React Hook Form with a Zod schema; validation messages come from the texts.
6. **Permissions in the UI.** Read the user's roles from `useSession()` and decide with `canAccess` from `src/core/auth/access.ts`. Never compare raw role strings.
7. **Texts.** Every user-facing text goes in the resources of `src/core/i18n/` in the three languages (`en.ts`, `es.ts` neutral Spanish, `pt-BR.ts` Brazilian Portuguese), under the same key, and is shown with `useTranslation()`. English is the initial language.
8. **UI library.** Not decided yet (ADR-0017); until then, plain semantic HTML.

### 7.2 Frontend rules

- TypeScript `strict` with the extra checks of `tsconfig.json` (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, …). No `any`, no `@ts-ignore` and no lint suppression without a written justification on the same line.
- A component file is named after its component in PascalCase (`HomePage.tsx`); any other module is lower case (`auth.ts`, `access.ts`). One component per file.
- No user-facing text in a component: it goes in the three language resources. A text missing in one language fails the tests.
- Configuration values come from `public/config.json` through `src/core/config/`. Never hard-code a URL, a realm, a client id or a role name.
- Tokens stay in memory. Never write a token or a refresh token to `localStorage`, `sessionStorage`, a cookie or a URL (ADR-0013).
- Dependencies are pinned to an exact version (`.npmrc` has `save-exact=true`), and a library is added by the first change that uses it (ADR-0012).
- Accessibility: the jsx-a11y rules are errors; interactive elements are real buttons and links, every input has a label.

### 7.3 Frontend tests — Vitest + React Testing Library (`ERAS-FE-React/src/`)

The test file sits next to the unit as `*.test.ts` or `*.test.tsx`. Use React Testing Library queries by role and visible text, `@testing-library/user-event` for interaction, and MSW (`msw/node`, `setupServer`) for HTTP. Import `describe`, `it`, `expect` and `vi` from `vitest` (no globals).

```tsx
describe('ConfigurationForm', () => {
  it('[608-reject-duplicate-configuration-name/AC-1] shows the conflict message when the name already exists', async () => {
    // GIVEN … WHEN … THEN
  });
});
```

The AC key goes **first in the `it()` title, in square brackets**, the same key as in the spec and in the other clients' tests. Write one `it()` per AC. Never commit `it.only`, `describe.only`, `it.skip`, `describe.skip`, `fit` or `xit`. The skill `.claude/skills/eras-fe-react-test/SKILL.md` walks through writing one AC test.
