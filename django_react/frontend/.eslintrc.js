// filepath: /home/johnny/react_side_project/django_react/frontend/.eslintrc.cjs
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  root: true,
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks', // 添加 react-hooks 插件
  ],
  rules: {
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['draft'] }],
    'linebreak-style': 0,
    'import/no-unresolved': 'off',
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error', // 添加 hooks 規則
    'react-hooks/exhaustive-deps': 'warn', // 添加 hooks 規則
    indent: ['error', 2, { SwitchCase: 1 }],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
      jsx: 'never',
    }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
