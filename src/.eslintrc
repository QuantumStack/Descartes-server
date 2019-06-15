module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    mocha: true,
  },
  plugins: [
    'security',
  ],
  extends: [
    'airbnb-base',
    'plugin:security/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "import/no-extraneous-dependencies": ["error", { "devDependencies": ["src/tests/**"] }]
  },
};
