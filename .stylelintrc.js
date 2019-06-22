// @ts-check

module.exports = {
  extends: [
    // As of 2019/05/24, npm package stylelint-config-airbnb is still at v0.0.0
    // and has not seen a release for a year
    // See https://github.com/airbnb/css/pull/56
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
