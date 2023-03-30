module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        semi: true,
        trailingComma: 'all',
        singleQuote: true,
        printWidth: 120,
        tabWidth: 2,
        arrowParens: 'avoid',
      },
    ],
    'camel-case': 0,
    'no-use-before-define': 0,
    'no-unused-vars': 'off',
    'react/prop-types': 0,
    'react/destructuring-assignment': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/no-this-alias': 1,
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'import/no-unresolved': 'error',
    'import/no-duplicates': 'off',
    'react/react-in-jsx-scope': 0,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/extensions': ['.js', '.ts', '.tsx'],
    'import/parser': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  ignorePatterns: ['node_modules', 'tsconfig.tsbuildinfo', '*.log', 'lib', 'dist'],
};
