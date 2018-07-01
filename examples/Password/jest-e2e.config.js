const { defaults } = require('jest-config');

module.exports = {
  preset: 'jest-puppeteer',

  transform: {
    '^.+\\.ts$': 'ts-jest'
  },

  // See How to use with create-react-app https://github.com/smooth-code/jest-puppeteer/issues/61
  // See Using Jest with Puppeteer and create-react-app https://github.com/facebook/create-react-app/issues/4023
  testRegex: '\\.test\\.e2e\\.ts$',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts']
};
