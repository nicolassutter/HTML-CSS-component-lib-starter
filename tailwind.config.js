module.exports = {
  purge: [
    './components/**/*.ejs',
    'index.ejs'
  ],
  /** Important pour la perf !! */
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
