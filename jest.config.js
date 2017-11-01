module.exports = {
  setupFiles: ['./src/SetupEnzyme.ts'],

  transform: {
    "^.+\\.tsx?$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
  },
  testPathIgnorePatterns: ['/node_modules/', '/examples/'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  mapCoverage: true
};
