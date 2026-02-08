module.exports = {
  // Specify the environment in which tests will run
  testEnvironment: 'node',

  // Jest will look for test files ending with .test.js inside any 'tests' folder
  testMatch: ['**/tests/**/*.test.js'],

  // Enable code coverage collection
  collectCoverage: true,

  // LIMIT coverage to MY feature only
  // This excludes teammates' code from coverage calculation
  collectCoverageFrom: [
    'utils/MikealLeowUtil.js',
  ],

  // Directory where coverage reports will be saved
  coverageDirectory: 'coverage/backend',

  // Coverage report formats
  // 'text' -> console output
  // 'html' -> detailed browser report
  coverageReporters: ['text', 'html'],
};
