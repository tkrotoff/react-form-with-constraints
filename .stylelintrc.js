// @ts-check

/** @type {Partial<import('stylelint').Configuration>} */
const config = {
  extends: [
    // As of 2020/03/18, stylelint-config-airbnb is still at v0.0.0
    // Is this future proof?
    // https://github.com/airbnb/css/pull/56
    'stylelint-config-airbnb',

    'stylelint-config-recommended-scss'
  ],

  rules: {
    // Conflicts with Prettier
    'string-quotes': null,
    'number-leading-zero': null,

    'rule-empty-line-before': null,
    'at-rule-empty-line-before': null,
    'scss/at-extend-no-missing-placeholder': null,
    'order/order': null
  }
};

module.exports = config;
