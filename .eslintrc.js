module.exports = {
  env: {
    node: true,
    es6: true,
    jest: true
  },
  plugins: ['import', 'standard', 'node', 'security', 'jest'],
  extends: ['standard', 'plugin:node/recommended'],
  rules: {
    semi: 'off',
    'no-process-exit': 'warn',
    'jest/no-disabled-tests': 'error',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'node/no-unsupported-features': 'off',
    'node/no-unpublished-require': 'off',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-object-injection': 'warn',
    'security/detect-possible-timing-attacks': 'error',
    'security/detect-pseudoRandomBytes': 'error',
    'space-before-function-paren': 'off',
    'object-curly-spacing': 'off'
  },
  parserOptions: {
    ecmaVersion: 8,
    ecmaFeatures: {
      impliedStrict: true
    }
  }
};
