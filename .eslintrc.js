module.exports = {
  env: {
    node: true,
    es6: true,
    jest: true
  },
  plugins: ['import', 'node'],
  extends: ['plugin:node/recommended'],
  rules: {
    semi: 'off',
    'no-process-exit': 'warn',
    'node/no-unsupported-features': 'off',
    'node/no-unpublished-require': 'off',
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
