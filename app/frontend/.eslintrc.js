module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  root: true,
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'airbnb-typescript',
    '@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
  ],
  rules: {
    'react/jsx-props-no-spreading': 'off',
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['draft'] }],
    'linebreak-style': 0,
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    indent: 'off',
    '@typescript-eslint/indent': ['error', 2, { SwitchCase: 1 }],
    'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
        js: 'never',
        jsx: 'never',
      },
    ],
    'max-len': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-unused-vars': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
};
