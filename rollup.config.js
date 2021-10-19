import postcss from 'rollup-plugin-postcss'
import typescript from '@rollup/plugin-typescript'

export default {
  input: 'config/input.ts',
  output: {
    file: 'dist/output.js'
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.front.json'
    }),
    postcss({
      extract: true,
      minimize: true,
      sourceMap: true
    })
  ]
}
