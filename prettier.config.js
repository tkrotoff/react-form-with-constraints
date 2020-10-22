// @ts-check

/** @type {import('prettier').Options} */
const config = {
  // https://github.com/airbnb/javascript/tree/eslint-config-airbnb-v16.1.0#strings--quotes
  // https://github.com/prettier/prettier/issues/4102
  //
  // ["Holding down the shift key every time you want a string kinda stinks. Your carpal tunnel will
  // thank you for using single quotes."](https://github.com/airbnb/javascript/issues/269#issuecomment-107319162)
  singleQuote: true,

  // https://github.com/airbnb/javascript/tree/eslint-config-airbnb-v16.1.0#whitespace--max-len
  printWidth: 100,

  // https://github.com/prettier/prettier/issues/68
  trailingComma: 'none',

  // https://github.com/prettier/prettier/issues/6929
  arrowParens: 'avoid'
};

module.exports = config;
