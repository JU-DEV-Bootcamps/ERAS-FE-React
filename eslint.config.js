import js from '@eslint/js';
import boundaries from 'eslint-plugin-boundaries';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const tokenMessage =
  'Tokens stay in memory: never use browser storage or cookies (AGENTS.md section 7.2, ADR-0013).';
const httpMessage =
  'Call the backend only through the client of src/core/http/ (AGENTS.md section 7.1, step 2).';
const layersMessage =
  'This import crosses the layers of AGENTS.md section 4.2 (ADR-0015): a feature imports only shared, core and app/session, never another feature.';
const storageGlobals = ['localStorage', 'sessionStorage'].map(name => ({
  name,
  message: tokenMessage,
}));
const storageProperties = [
  { object: 'window', property: 'localStorage', message: tokenMessage },
  { object: 'window', property: 'sessionStorage', message: tokenMessage },
  { object: 'document', property: 'cookie', message: tokenMessage },
];

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      reactHooks.configs.flat.recommended,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // Sensors for the AGENTS.md section 7 rules (change 0006-add-eras-fe-react-agent-tooling): ESLint core rules only.
  // Two blocks that name the same rule for the same file replace each other, so each block lists every value it needs.
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportDefaultDeclaration',
          message:
            'Use a named export: no default exports (AGENTS.md section 7.1, step 4).',
        },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/**/*.test.{ts,tsx}', 'src/test/**'],
    rules: {
      'no-restricted-globals': ['error', ...storageGlobals],
      'no-restricted-properties': ['error', ...storageProperties],
    },
  },
  {
    files: ['src/{app,features,shared}/**/*.{ts,tsx}'],
    ignores: ['src/**/*.test.{ts,tsx}', 'src/test/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [{ name: 'axios', message: httpMessage }],
        },
      ],
      'no-restricted-globals': [
        'error',
        ...storageGlobals,
        { name: 'fetch', message: httpMessage },
      ],
      'no-restricted-properties': [
        'error',
        ...storageProperties,
        { object: 'window', property: 'fetch', message: httpMessage },
      ],
    },
  },
  {
    files: ['src/core/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: String.raw`^(\.\./)+(app|features)(/|$)`,
              message:
                'src/core uses nothing from src/app or src/features: dependencies point inward (AGENTS.md section 4.2).',
            },
          ],
        },
      ],
    },
  },
  // The layers of AGENTS.md section 4.2 (ADR-0015): a feature imports only shared, core and app/session, never
  // another feature; core imports only core; shared imports only shared and core. Imports inside one element pass.
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'import/resolver': {
        node: { extensions: ['.ts', '.tsx', '.js'] },
      },
      'boundaries/files': [
        { pattern: 'src/main.tsx', category: 'main' },
        { pattern: 'src/app/session.tsx', category: 'session' },
      ],
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app' },
        { type: 'core', pattern: 'src/core' },
        { type: 'feature', pattern: 'src/features/*', capture: ['name'] },
        { type: 'shared', pattern: 'src/shared' },
        { type: 'test', pattern: 'src/test' },
      ],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          message: layersMessage,
          policies: [
            { allow: { dependency: { relationship: { to: 'internal' } } } },
            {
              from: { file: { categories: 'main' } },
              allow: { to: { element: { types: ['app', 'core'] } } },
            },
            {
              from: { element: { types: ['app', 'test'] } },
              allow: {
                to: {
                  element: {
                    types: ['app', 'core', 'feature', 'shared'],
                  },
                },
              },
            },
            {
              from: { element: { type: 'feature' } },
              allow: {
                to: { element: { types: ['shared', 'core', 'test'] } },
              },
            },
            {
              from: { element: { type: 'feature' } },
              allow: { to: { file: { categories: 'session' } } },
            },
            {
              from: { element: { type: 'shared' } },
              allow: { to: { element: { types: ['core', 'test'] } } },
            },
            {
              from: { element: { type: 'core' } },
              allow: { to: { element: { type: 'test' } } },
            },
          ],
        },
      ],
    },
  },
  {
    files: ['eslint.config.js', 'commitlint.config.js', 'scripts/**/*.mjs'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  // Prettier formatting as an ESLint rule, as in ERAS-FE, but as an error: the v3 lint gate blocks (ADR-0012).
  eslintPluginPrettierRecommended,
  { rules: { 'prettier/prettier': ['error', { endOfLine: 'auto' }] } }
);
