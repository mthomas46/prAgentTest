module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', {
      tsconfig: {
        allowJs: true,
        target: 'es2018',
        moduleResolution: 'node',
        esModuleInterop: true,
        resolveJsonModule: true,
      },
      diagnostics: {
        ignoreCodes: [151001],
      },
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@nestjs|@babel|typeorm|uuid)/)',
  ],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  moduleDirectories: ['node_modules', 'src'],
  testTimeout: 30000,
  verbose: true,
  detectOpenHandles: true,
  forceExit: true,
};