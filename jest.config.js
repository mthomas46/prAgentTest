module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', {
      tsconfig: {
        allowJs: true,
        target: 'es2022',
      },
    }],
    'node_modules/@nestjs/.*\\.js$': 'babel-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/test/', '<rootDir>/services/'],
  moduleNameMapper: {
    '^node:(.*)$': '<rootDir>/node_modules/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(?:@nestjs|@babel|typeorm|uuid|@typeorm/.*)/).*',
  ],
  moduleDirectories: ['node_modules'],
  testTimeout: 30000,
};