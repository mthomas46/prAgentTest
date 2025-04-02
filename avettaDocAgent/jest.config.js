/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      diagnostics: {
        ignoreCodes: [1343]  // Ignore 'import not found' errors
      }
    }]
  },
  moduleNameMapper: {
    '^../mcp-config.ts$': '<rootDir>/mcp-config.ts'
  },
  testMatch: ['**/*.spec.ts'],
  setupFiles: ['./jest.setup.js'],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
}; 