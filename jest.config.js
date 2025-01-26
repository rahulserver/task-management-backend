module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    moduleNameMapper: {
      '@/(.*)': '<rootDir>/src/$1'
    },
    collectCoverageFrom: ['src/**/*.ts'],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
      'node_modules',
      'test-config',
      'interfaces',
      'jestGlobalMocks.ts',
      '.module.ts',
      '<rootDir>/src/index.ts',
      '.mock.ts'
    ]
  };
  