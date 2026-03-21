module.exports = {
  rootDir: '.',
  testEnvironment: 'node',
  preset: 'ts-jest',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  testMatch: [
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/action/__tests__/**/*.test.js',
    '<rootDir>/cli/__tests__/**/*.test.js',
    '<rootDir>/tests/**/*.test.js'
  ],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '<rootDir>/action/**/*.js',
    '!<rootDir>/src/**/*.test.ts',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/action/**/__tests__/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};