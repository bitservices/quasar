import eslint from '@eslint/js';
import vue from 'eslint-plugin-vue';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  eslint.configs.recommended,
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '.git/',
      '*.min.js',
      '*.spec.js',
      '*.test.js'
    ],
    files: ['**/*.js', '**/*.ts', '**/*.vue'],
    languageOptions: {
      parser: tsparser,
      sourceType: 'module',
    },
    plugins: {
      vue,
      '@typescript-eslint': tseslint,
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
];
