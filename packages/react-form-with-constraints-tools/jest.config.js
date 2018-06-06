const { defaults } = require('jest-config');

module.exports = {
  setupFiles: ['../react-form-with-constraints/jest.setup.ts'],

  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },

  testRegex: '\\.test\\.tsx?$',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx']
};
