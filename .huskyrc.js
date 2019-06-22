// @ts-check

module.exports = {
  hooks: {
    'pre-commit': 'yarn precommit',
    'pre-push': 'yarn prepush'
  }
};
