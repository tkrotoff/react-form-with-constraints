// @ts-check

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 2,
        debug: false
      }
    ],
    '@babel/preset-react'
  ]
};
