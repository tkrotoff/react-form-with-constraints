// @ts-check

module.exports = {
  presets: [['@babel/preset-react', { runtime: 'automatic' }], '@babel/preset-typescript'],
  plugins: [
    // https://mobx.js.org/enabling-decorators.html
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: false }]
  ]
};
