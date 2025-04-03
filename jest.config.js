module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', {
      tsconfig: {
        allowJs: true,
        target: 'ES2020'
      }
    }]
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/', '<rootDir>/test/'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^url$': '<rootDir>/node_modules/node-libs-browser/node_modules/url/url.js',
    '^uuid$': 'uuid'
  },
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!@nestjs/common|@nestjs/core|@nestjs/testing|typeorm|@nestjs/platform-express)'
  ]
}; 