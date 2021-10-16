const gulp = require('gulp')
const sass = require('sass')
const gulp_sass = require('gulp-sass')(sass)
const postcss = require('gulp-postcss')
const cleanCSS = require('gulp-clean-css')
const css_path = './assets/css/**/*.scss'
const build = require('./build.js')
const bs = require('browser-sync')
const config = require('./config/config.js')

const sync = bs.create()

const process_css = () => {
  return build().then(() => {
    const tailwindcss = require('tailwindcss')
    const autoprefixer = require('autoprefixer')
  
    const task = gulp.src(css_path)
      .pipe(gulp_sass().on('error', gulp_sass.logError))
      .pipe(postcss([
        tailwindcss(),
        autoprefixer
    ]))
  
    if (process.env.NODE_ENV === 'production') {
      /** On minifie le css en production */
      task.pipe(cleanCSS())
    }
  
    return task
      .pipe(gulp.dest('./dist/css'))
      .pipe(sync.stream())
  })
}

const dev = () => {
  sync.init({ proxy: `http://localhost:${config.port}` })

  process_css().then(() => {
    gulp.watch(css_path, process_css)

    gulp.watch([
      'components/**/*.ejs',
      'index.ejs',
    ]).on('change', sync.reload)
  })
}

exports.process_css = process_css
exports.dev = dev