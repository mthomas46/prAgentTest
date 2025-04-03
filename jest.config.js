module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(?:@nestjs|@babel)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/test/**/*.spec.ts', '**/test/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
}; 