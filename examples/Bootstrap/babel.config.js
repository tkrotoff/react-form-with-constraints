// @ts-check

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 3,
        debug: false
      }
    ],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ]
};
