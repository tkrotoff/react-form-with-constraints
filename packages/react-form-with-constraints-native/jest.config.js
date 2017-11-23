module.exports = {
  preset: 'react-native',

  setupFiles: ['../react-form-with-constraints/src/SetupEnzyme.ts'],

  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}'
  ],
  mapCoverage: true
};
