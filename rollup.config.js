import pkg from './package.json'

export default {
  input: './src/index.js',
  output: [
    {
      file: pkg.module,
      format: 'esm'
    },
    {
      name: 'Binder',
      file: pkg.browser,
      format: 'umd'
    }
  ]
}
