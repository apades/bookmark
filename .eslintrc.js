let config = require('../.eslintrc.js')
module.exports = {
  root: true,
  ...config,
  ignorePatterns: ['dist', 'lib/video_wasm'],
  rules: {
    ...config.rules,
    'no-empty': 0,
    '@typescript-eslint/no-empty-function': 0,
  },
}
