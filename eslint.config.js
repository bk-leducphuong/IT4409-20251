import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginNode from 'eslint-plugin-node';
import prettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['node_modules', 'dist', 'build', 'coverage'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'jsx-a11y': pluginJsxA11y,
      node: pluginNode,
      prettier: pluginPrettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginJsxA11y.configs.recommended.rules,
      'prettier/prettier': 'warn',
      'react/react-in-jsx-scope': 'off', // React 17+ JSX transform
      'no-console': 'off',
      'no-unused-vars': 'warn',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  // Backend specific overrides
  {
    files: ['backend/**/*.{js}'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'no-console': 'off',
    },
  },
  // Frontend specific overrides
  {
    files: ['frontend/**/*.{js,jsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'react/prop-types': 'off',
    },
  },
  prettier,
];
