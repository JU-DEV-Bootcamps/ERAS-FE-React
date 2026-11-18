---
name: eras-fe-react-test
description: Writes one tagged Acceptance Criterion test in ERAS v3 (ERAS-FE-React) with Vitest, React Testing Library and MSW, test first. Use when /sdd-implement reaches a test task for the FE-React side, or when the user asks for the v3 test of an AC (an AC key like <change-id>/AC-<n>). Writes tests only, never the code under test, and never commits.
---

Write the one test that proves one AC on the `FE-React` side, see it fail, and hand back. The conventions are
`AGENTS.md` §7.3 of this repository; the AC↔test rule is §5.2 of the parent's `AGENTS.md`.

**Boundary.** Create or edit only `*.test.ts` / `*.test.tsx` files under `src/` (and MSW handlers inside them).
Do not write the code under test, do not edit the spec, do not commit.

## Steps

1. **Read the AC.** Get the scenario from `openspec/changes/<change-id>/specs/**/spec.md` in the parent repository:
   its key `<change-id>/AC-<n>`, its GIVEN / WHEN / THEN, and its `**Side:**` line, which must name `FE-React`.
   If it does not, stop: the AC needs no v3 test.
2. **Pick the unit and the file.** The test sits next to the unit that decides the behavior the user sees, as
   `<Unit>.test.tsx` for a component or `<module>.test.ts` for a hook or function. Reuse the file if it exists.
3. **Write the test.** One `it()` whose title starts with the key in square brackets, then the behavior:

   ```tsx
   import { render, screen } from '@testing-library/react';
   import userEvent from '@testing-library/user-event';
   import { http, HttpResponse } from 'msw';
   import { setupServer } from 'msw/node';
   import {
     afterAll,
     afterEach,
     beforeAll,
     describe,
     expect,
     it,
   } from 'vitest';

   const server = setupServer();
   beforeAll(() => {
     server.listen({ onUnhandledFrame: 'error' });
   });
   afterEach(() => {
     server.resetHandlers();
   });
   afterAll(() => {
     server.close();
   });

   describe('<Unit>', () => {
     it('[<change-id>/AC-<n>] <the behavior the user sees, from the THEN>', async () => {
       // GIVEN: the API answer of the scenario
       server.use(
         http.get('*/api/v1/<resource>', () => HttpResponse.json(/* … */))
       );
       // WHEN: render, then act as the user does
       render(/* the unit, inside the providers it needs */);
       await userEvent.click(
         screen.getByRole('button', { name: '<visible text>' })
       );
       // THEN: assert what the user sees
       expect(await screen.findByText('<visible text>')).toBeInTheDocument();
     });
   });
   ```

   - Query by role, label and visible text, never by CSS class or test id unless nothing else exists.
   - A screen that needs translations, server state or the session gets them from `AppProviders` and
     `SessionProvider` (`src/app/`), as `src/app/routing/routing.test.tsx` does.
   - The assertions must check the THEN of the scenario, not merely render the unit.
   - Helper or edge-case tests are welcome but carry **no** AC key; one key per test, one test per AC on this side.

4. **Run it alone and watch it fail** for the right reason (the behavior is missing, not a typo):
   `npm test -- run <path of the test file>`. Report the failure message.
5. **Never leave** `it.only`, `describe.only`, `it.skip`, `describe.skip`, `fit` or `xit` in the file.

## Report

The test file and title, the command you ran, and the failure it printed. The implementation is the next task.
