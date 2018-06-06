const { defaults } = require('jest-config');

module.exports = {
  preset: 'react-native',

  setupFiles: ['../react-form-with-constraints/jest.setup.ts'],

  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest'
  },

  testRegex: '\\.test\\.tsx?$',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx']
};
