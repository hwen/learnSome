import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  name: 'vdom.js',
  input: './src/index.js',
  output: {
    file: './dist/vdom.js',
    format: 'umd'
  },
  plugins: [
    resolve(),
    commonjs()
  ]
}
