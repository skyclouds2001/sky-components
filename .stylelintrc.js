module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  rules: {
    'no-empty-source': null,
  },
  plugins: [],
  overrides: [
    {
      files: ['**/*.vue'],
      extends: ['stylelint-config-standard-vue'],
    },
    {
      files: ['**/*.scss'],
      extends: ['stylelint-config-standard-scss', 'stylelint-config-prettier-scss'],
    },
  ],
}
