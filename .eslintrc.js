module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
    jquery: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  ignorePatterns: ['dist', '*.html']
}
