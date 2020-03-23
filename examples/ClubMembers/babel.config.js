// @ts-check

module.exports = {
  presets: ['@babel/preset-react', '@babel/preset-typescript'],
  plugins: [
    // https://github.com/babel/website/blob/f7d4276a40ded66244272f0e23d3eee540cf1fc2/docs/plugin-proposal-decorators.md#legacy
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }]
  ]
};
