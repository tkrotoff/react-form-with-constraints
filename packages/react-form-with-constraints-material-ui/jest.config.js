const { defaults } = require('jest-config');

module.exports = {
  setupFiles: ['../react-form-with-constraints/src/JestSetup.ts'],

  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },

  testRegex: '\\.test\\.tsx?$',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx']
};
