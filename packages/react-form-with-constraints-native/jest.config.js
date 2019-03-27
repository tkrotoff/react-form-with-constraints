module.exports = {
  preset: 'react-native',

  setupFiles: ['../react-form-with-constraints/jest.setup.ts'],

  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest'
  }
};
