module.exports = {
  testEnvironment: 'node',
  verbose: true,
  notify: true,
  testPathIgnorePatterns: ['/__tests__/.*/__fixtures__/.*'],
  collectCoverageFrom: ['index.js', 'src/**/*.{js,ts}'],
  testMatch: ['**/*.test.js']
};
