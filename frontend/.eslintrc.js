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
    project: require.resolve('./tsconfig.json'),
  },
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'prettier', '@typescript-eslint'],
  rules: {
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
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],

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
    // 'no-console': 'warn',
    'no-unused-vars': [
      'error',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: true, argsIgnorePattern: '^_' },
    ],
    'react/no-array-index-key': 'off',
    'react/no-unstable-nested-components': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.{js,jsx}',
          '**/*.spec.{js,jsx}',
          '**/setupTests.{js,jsx}',
          '**/src/**/*.{js,jsx}',
          '**/*.config.{js,jsx}',
          '**/*.setup.{js,jsx}',
          '**/vite.config.{js,jsx}',
          '**/webpack.config.{js,jsx}',
          '**/rollup.config.{js,jsx}',
          '**/jest.config.{js,jsx}',
          '**/craco.config.{js,jsx}',
        ],
        optionalDependencies: false,
        packageDir: __dirname,
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      alias: {
        map: [
          ['@', `${__dirname}/src`],
          ['@components', `${__dirname}/src/components`],
          ['@constant', `${__dirname}/src/constant`],
          ['@hooks', `${__dirname}/src/hooks`],
          ['@images', `${__dirname}/src/images`],
          ['@styleLayouts', `${__dirname}/src/styles/layouts`],
          ['@styleViews', `${__dirname}/src/styles/views`],
          ['@redux', `${__dirname}/src/redux`],
          ['@utils', `${__dirname}/src/utils`],
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        paths: ['node_modules', `${__dirname}/node_modules`],
      },
    },
  },
};
