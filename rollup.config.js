import postcss from 'rollup-plugin-postcss'

export default {
  input: 'config/input.js',
  output: {
    file: 'dist/output.js',
    format: 'esm'
  },
  plugins: [
    postcss({
      extract: true,
      minimize: true,
      sourceMap: true,
    })
  ]
}