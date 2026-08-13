/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.test.js'],
  // Loads objix and detaches its @@iterator so Jest's object equality stays
  // order-insensitive. See test/setup.js for the full rationale.
  setupFiles: ['<rootDir>/test/setup.js'],
  collectCoverageFrom: ['objix.js'],
  coverageReporters: ['text', 'lcov'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: { statements: 100, branches: 100, functions: 100, lines: 100 }
  }
}
