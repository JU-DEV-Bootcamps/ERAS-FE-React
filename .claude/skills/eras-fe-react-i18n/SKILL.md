---
name: eras-fe-react-i18n
description: Adds or changes user-facing texts of ERAS v3 (ERAS-FE-React) in its three languages - English (reference), neutral Spanish with formal "usted", and Brazilian Portuguese - under the same key in src/core/i18n/en.ts, es.ts and pt-BR.ts, then runs the translation test. Use whenever a v3 screen, message or validation needs text, or when the user asks to add or fix a translation. Edits only the three resources and never commits.
---

Every user-facing text of v3 lives in `src/core/i18n/` in three languages under one key (`AGENTS.md` §7.1
step 7 and §7.2). A component never holds text: it shows `t('<key>')`.

**Boundary.** Edit only `src/core/i18n/en.ts`, `es.ts` and `pt-BR.ts`, plus the `t('…')` call in the component
that shows the text. Do not change the language setup in `i18n.ts`, and do not commit.

## Steps

1. **Choose the key.** Group it by where it is shown, in camelCase:
   - a shell page uses `<screen>.<item>` (as the existing `home.title` and `accessDenied.message`);
   - a feature uses `<feature>.<screen>.<item>` (for example `students.list.title` or
     `students.form.nameRequired`).

   Reuse an existing key only when the text means the same thing in the same place.

2. **Write English first** in `en.ts`, the reference language: plain and short, sentence case, no trailing
   period on titles and buttons. `en.ts` defines the type `Translation`, so the other two files must follow it.
3. **Write neutral Spanish** in `es.ts`, under the same key:
   - address the user with formal **"usted"**, as the existing texts do (`No tiene permiso…`);
   - use no regional words and no voseo;
   - keep the accents and the opening `¿` and `¡`.
4. **Write Brazilian Portuguese** in `pt-BR.ts`, under the same key:
   - use Brazil's forms and spelling (`você`, `arquivo`, `tela`, `usuário`), never European Portuguese;
   - keep the accents.
5. **Variables.** Use i18next interpolation with the same name in all three files, for example
   `'{{count}} students'`. Never build a sentence by joining strings in the component. For plurals use the
   i18next plural keys (`_one`, `_other`) in every language.
6. **Show it.** In the component, call `const { t } = useTranslation();` and render `{t('students.list.title')}`.
7. **Run the translation test.** It fails when one language misses a key or has an extra one:
   `npm test -- run src/core/i18n`. Then run the test of the screen you touched.

## Report

The keys you added or changed with their three texts, and the result of `npm test -- run src/core/i18n`.
