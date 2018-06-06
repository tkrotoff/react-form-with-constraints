const { defaults } = require('jest-config');

module.exports = {
  setupFiles: ['./jest.setup.ts'],
  coveragePathIgnorePatterns: [...defaults.coveragePathIgnorePatterns, './jest.setup.ts'],

  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },

  // See https://github.com/facebook/jest/blob/v18.1.0/packages/jest-config/src/defaults.js#L53
  testRegex: '\\.test\\.tsx?$',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx']
};
