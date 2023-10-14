module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  plugins: [],
  rules: {
    'no-empty-source': null,
  },
  overrides: [
    {
      files: ['**/*.vue'],
      extends: ['stylelint-config-standard-vue'],
    },
  ],
}
