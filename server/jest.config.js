/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/**/*.test.ts"], //telling jest where to find test files
  verbose: true, //each individual  test should be reported during run
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};