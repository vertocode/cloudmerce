import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    files: ['**/*.vue', '**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/no-multiple-template-root': 'off',
      'vue/valid-define-emits': 'off',
      'vue/no-use-v-if-with-v-for': 'off',
      '@stylistic/no-mixed-operators': 'off',
      'vue/require-explicit-emits': 'off',
    },
  },
  // your custom flat configs go here, for example:
  // {
  //   files: ['**/*.ts', '**/*.tsx'],
  //   rules: {
  //     'no-console': 'off' // allow console.log in TypeScript files
  //   }
  // },
  // {
  //   ...
  // }
)
