const { defaults } = require('jest-config');

module.exports = {
  setupFiles: ['./jest.setup.ts'],
  coveragePathIgnorePatterns: [...defaults.coveragePathIgnorePatterns, './jest.setup.ts'],

  preset: 'ts-jest'
};
