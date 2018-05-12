// See Export default config https://github.com/facebook/jest/issues/5943
const defaults = require('jest-config/build/defaults').default;

module.exports = {
  setupFiles: ['../react-form-with-constraints/src/JestSetup.ts'],

  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx']
};
