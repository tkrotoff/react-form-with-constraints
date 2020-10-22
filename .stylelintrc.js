// @ts-check

/** @type {Partial<import('stylelint').Configuration>} */
const config = {
  extends: [
    // /!\ Order matters: the next one overrides rules from the previous one

    // Includes stylelint-config-recommended-scss and stylelint-config-standard
    'stylelint-config-twbs-bootstrap/scss',

    'stylelint-prettier/recommended'
  ],

  rules: {}
};

module.exports = config;
