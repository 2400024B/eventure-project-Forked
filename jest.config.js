module.exports = {
  // Specify the environment in which tests will run
  testEnvironment: 'node',

  // Jest will look for test files ending with .test.js inside any 'tests' folder
  testMatch: ['**/tests/**/*.test.js'],

  // Enable code coverage collection
  collectCoverage: true,

  // Specify which files to include in the coverage report
  collectCoverageFrom: [
    'utils/**/*.js',
    'index.js',
  ],

  // Directory where coverage reports will be saved
  coverageDirectory: 'coverage/backend',

  // Coverage report formats
  // 'text' -> console output
  // 'html' -> detailed browser report
  coverageReporters: ['text', 'html'],
};
