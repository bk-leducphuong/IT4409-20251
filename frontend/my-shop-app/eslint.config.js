import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'


export default [
  { ignores: ['dist'] },
  // Spread the recommended configs directly into the array
  { ...js.configs.recommended },
  { ...reactHooks.configs['recommended-latest'] },
  { ...reactRefresh.configs.vite },
  // Add custom config, overriding or extending as needed
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
