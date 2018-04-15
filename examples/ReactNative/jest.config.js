// See Export default config https://github.com/facebook/jest/issues/5943
const defaults = require('jest-config/build/defaults').default;

module.exports = {
  preset: 'jest-expo',

  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  // See https://github.com/facebook/jest/blob/v18.1.0/packages/jest-config/src/defaults.js#L53
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', ...defaults.moduleFileExtensions]
};
