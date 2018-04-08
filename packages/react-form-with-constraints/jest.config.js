// See Export default config https://github.com/facebook/jest/issues/5943
const defaults = require('jest-config/build/defaults').default;

module.exports = {
  setupFiles: ['./src/JestSetup.ts'],
  coveragePathIgnorePatterns: [...defaults.coveragePathIgnorePatterns, './src/JestSetup.ts'],

  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  // See https://github.com/facebook/jest/blob/v18.1.0/packages/jest-config/src/defaults.js#L53
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx']
};
