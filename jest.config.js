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
  // Functions is not 100 because _eval builds three throwaway function literals
  // (async, generator, async generator) purely to read their constructors off
  // their prototypes. They exist to be swapped out, never to be called, so no
  // test can cover them. Everything else is held at 100.
  coverageThreshold: {
    global: { statements: 100, branches: 100, functions: 95, lines: 100 }
  }
}
