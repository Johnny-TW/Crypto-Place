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
    'react/jsx-props-no-spreading': 'off', // 關閉 props 展開規則
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['draft'] }], // 關閉對 draft 的規則
    'linebreak-style': 0, // 關閉換行符規則
    'import/no-unresolved': 'off', // 關閉 import 無法解析規則
    'react/prop-types': 'off', // 關閉 prop-types 規則
    'react-hooks/rules-of-hooks': 'error', // 添加 hooks 規則
    'react-hooks/exhaustive-deps': 'warn', // 添加 hooks 規則
    indent: ['error', 2, { SwitchCase: 1 }], // 設置縮進為 2 個空格
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }], // 允許使用 .js 和 .jsx 文件
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
      jsx: 'never',
    }],
    // 允許 import 不帶副檔名
    'max-len': 'off', // 關閉 max-len 規則
    'jsx-a11y/anchor-is-valid': 'off', // 關閉 anchor-is-valid 規則
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
