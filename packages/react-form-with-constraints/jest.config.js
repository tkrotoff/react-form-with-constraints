module.exports = {
  setupFiles: ['./src/SetupEnzyme.ts'],

  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],

  mapCoverage: true
};
