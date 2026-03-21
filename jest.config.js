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
    '<rootDir>/action/__tests__/**/*.jest.test.js',
    '<rootDir>/action/__tests__/merger.test.js',
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
  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: [151002]
      }
    }
  }
};