module.exports = {
  root: true,
  env: {
    // 启用 es6 除了模块的所有特性
    es6: true,
    // browser global variables
    browser: true,
    // 启用 nodejs 全局变量和作用域
    node: true,
    // CommonJS全局变量和作用域 (use this for browser-only code that uses Browserify/WebPack).
    commonjs: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    // 启用 es6 模块语法
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
