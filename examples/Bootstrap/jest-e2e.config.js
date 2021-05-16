// @ts-check

/** @type Partial<import('@jest/types').Config.InitialOptions> */
const config = {
  preset: 'jest-puppeteer',

  // [How to use with create-react-app](https://github.com/smooth-code/jest-puppeteer/issues/61)
  // [Using Jest with Puppeteer and create-react-app](https://github.com/facebook/create-react-app/issues/4023)
  testRegex: '\\.test\\.e2e\\.js$'
};

module.exports = config;
