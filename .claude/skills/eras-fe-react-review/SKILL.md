---
name: eras-fe-react-review
description: Reviews a diff of ERAS v3 (ERAS-FE-React) against the AGENTS.md §7 rules that lint cannot check - texts outside the resources, server data in component state, raw role strings, route roles versus the spec, accessibility beyond jsx-a11y, unplanned libraries, AC tests that only render - and reports findings with file:line. Use when the user asks to review v3 code, a v3 branch or a change's FE-React work before /sdd-verify. Read-only - edits nothing and never commits.
---

Review the v3 code of a diff for the rules of `AGENTS.md` §7.1–7.3 that `npm run lint` does not enforce. Lint
already fails on default exports, `axios` or `fetch` outside `src/core/`, browser storage and cookies,
`core` importing `app` or `features`, the jsx-a11y rules and the TypeScript checks, so do not report those again.

**Boundary.** Read only. Do not edit, format, fix or commit. This review does not replace `/sdd-verify`, which
audits tasks, AC tests, gates and drift.

## Steps

1. **Get the diff.** Use the range the user gives. Otherwise use the current branch against `develop`:
   `git -C ERAS-FE-React diff develop...HEAD`. When the work belongs to a change, read its spec
   (`openspec/changes/<change-id>/specs/**/spec.md` in the parent repository) and its `design.md`.
2. **Check each item** on the changed lines, and on whole files only where a rule needs it:

   | #   | Rule                             | What to look for                                                                                                                                                                                                                                                |
   | --- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | 1   | Texts (§7.1 step 7, §7.2)        | A user-facing string literal in JSX, `aria-label`, `title`, `placeholder` or an error message, instead of `t('…')`; a key missing in `es.ts` or `pt-BR.ts`; a Spanish text that is not neutral or does not use "usted"; a Portuguese text that is not Brazilian |
   | 2   | Server state (§7.1 step 3)       | Server data copied into `useState` or `useEffect`; a request made outside a TanStack Query hook                                                                                                                                                                 |
   | 3   | Permissions (§7.1 step 6)        | A comparison with a raw role name or a Keycloak role string, instead of `canAccess` with `useSession()`                                                                                                                                                         |
   | 4   | Route roles (§7.1 step 1)        | The `roles` of a new `appRoutes` entry differ from the roles the spec's ACs give that screen, or a role check inside the page repeats `RoleGuard`                                                                                                               |
   | 5   | Layers (§4.2)                    | A feature that imports another feature; code in `src/shared/` used by only one feature                                                                                                                                                                          |
   | 6   | Components (§7.1 step 4, §7.2)   | More than one component per file; a file name that does not match its component; props without an `interface`                                                                                                                                                   |
   | 7   | Accessibility beyond lint (§7.2) | A clickable `div` or `span`; an input whose label is not tied to it; headings that skip levels; information shown by color only                                                                                                                                 |
   | 8   | Configuration and tokens (§7.2)  | A hard-coded URL, realm, client id or role name instead of `src/core/config/`; a token placed in a URL                                                                                                                                                          |
   | 9   | Dependencies (§7.2, ADR-0012)    | A new package in `package.json` that no task of the change names, or one not pinned to an exact version                                                                                                                                                         |
   | 10  | AC tests (§7.3)                  | An `[<change-id>/AC-n]` test that only renders and does not assert the THEN of its scenario; a query by CSS class or test id where a role or text exists                                                                                                        |
   | 11  | Accepted ADRs                    | API code that departs from ADR-0014 (generated code, axios outside `src/core/http/`, a response without its Zod schema, an `ApiError` body shown or logged), state that departs from ADR-0015, or a color, size or library that departs from ADR-0016           |

3. **Check each finding against the code** before reporting it. Report only what you can point to.

## Report

One line per finding: `<path>:<line> — <rule #> <what is wrong> → <what the rule asks for>`, most important
first. End with the count of findings, or "No findings" when there are none. Do not paste code blocks longer
than three lines.
