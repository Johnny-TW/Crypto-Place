module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  root: true,
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    'jsx-a11y',
    'prettier',
    '@typescript-eslint',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': 'error',
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/no-invalid-html-attribute': 'error',
    'react/no-unsafe': 'error',
    'react/void-dom-elements-no-children': 'error',
    'react/jsx-no-constructed-context-values': 'error',
    'react/jsx-no-leaked-render': 'error',
    'react/jsx-pascal-case': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],

    'default-param-last': 'off',
    'no-param-reassign': [
      'error',
      { props: true, ignorePropertyModificationsFor: ['draft'] },
    ],
    'linebreak-style': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'max-len': [
      'error',
      { code: 200, ignoreComments: true, ignoreStrings: true },
    ],
    'jsx-a11y/anchor-is-valid': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
      },
    ],
    'react/no-array-index-key': 'off',
    'react/no-unstable-nested-components': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.{js,jsx,ts,tsx}',
          '**/*.spec.{js,jsx,ts,tsx}',
          '**/setupTests.{js,jsx,ts,tsx}',
          '**/src/**/*.{js,jsx,ts,tsx}',
          '**/*.config.{js,jsx,ts,tsx}',
          '**/*.setup.{js,jsx,ts,tsx}',
          '**/vite.config.{js,jsx,ts,tsx}',
          '**/webpack.config.{js,jsx,ts,tsx}',
          '**/rollup.config.{js,jsx,ts,tsx}',
          '**/jest.config.{js,jsx,ts,tsx}',
          '**/craco.config.{js,jsx}',
        ],
        optionalDependencies: false,
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  overrides: [
    {
      files: ['*.tsx', '*.jsx'],
      rules: {
        'react/function-component-definition': [
          'error',
          {
            namedComponents: ['arrow-function', 'function-declaration'],
            unnamedComponents: ['arrow-function'],
          },
        ],
      },
    },
    {
      // 對於 JS 配置文件不使用 TypeScript 解析器
      files: ['.eslintrc.js', '*.config.js', '*.setup.js'],
      parserOptions: {
        project: null, // 不要求 tsconfig
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
      },
    },
  ],
};
