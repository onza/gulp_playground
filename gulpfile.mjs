import gulp from 'gulp'
// const { series, parallel, src, dest, task } = gulp
// const { task } = gulp

import {deleteSync} from 'del'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
const sass = gulpSass( dartSass )
import autoprefixer from 'gulp-autoprefixer'
import rename from 'gulp-rename'
import cleancss from 'gulp-clean-css'
import concat from 'gulp-concat'
import terser from 'gulp-plugin-terser'
import imagemin, {mozjpeg, gifsicle, optipng, svgo} from 'gulp-imagemin'
import svgSprite from 'gulp-svg-sprite'
import browserSync from 'browser-sync'


// clean up dist directory
// -------------------------------------------------------------------------
function clean(done) {
  deleteSync([
    '.temp/*',
    'dist/*'
  ])
  done()
}


// build styles ...
// -------------------------------------------------------------------------
function styles() {
  return gulp
    .src('src/scss/main.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleancss())
    .pipe(rename({
      basename: 'all',
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/css/'))
}


// concatenates and uglifies js
// -------------------------------------------------------------------------
function scripts() {
  return gulp
    .src([
      'src/js/title.js',
      'src/js/accordion.js',
      'src/js/year.js',
    ])
    .pipe(terser())
    .pipe(concat('bundle.min.js'))
    .pipe(gulp.dest('dist/js/'))
}


// image optimization
// -------------------------------------------------------------------------
function imageoptim() {
  return gulp
    .src('src/images/**/*', { encoding: false })
    .pipe(imagemin([
      mozjpeg({
        progressive: true,
        quality: 80
      })
    ]))
    .pipe(gulp.dest('dist/images/'))
}

// icon optimization to .temp folder
function iconoptim() {
  return gulp
    .src('src/icons/*.svg')
    .pipe(imagemin([
      gifsicle({interlaced: true}),
      optipng({optimizationLevel: 5}),
      svgo({
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: { 
                removeViewBox: false,
                removeTitle: false,
                cleanupIDs: false 
              }
            }
          }
        ]
      })
    ]))
    .pipe(gulp.dest('dist/icons/'))
}

// optimization for icons of the icon sprite
function spriteiconoptim() {
  return gulp.src('src/icons/iconset/*.svg')
    .pipe(imagemin([
      svgo({
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: { 
                removeViewBox: false,
                removeTitle: false,
                cleanupIDs: false 
              }
            }
          }
        ]
      })
    ]))
    .pipe(gulp.dest('.temp/iconset/'))
}


// build svg sprite
// -------------------------------------------------------------------------
function sprite() {
  return gulp.src('.temp/iconset/*.svg')
    .pipe(svgSprite({
      mode: {
        symbol: {
          // inline: true,
          // prefix: '#Icon-XYZ', 
          example: false,
          sprite: 'sprite.svg',
          dest: ''
        }
      }
    }))
    .pipe(gulp.dest('dist/icons/'))
}


// copy files
// -------------------------------------------------------------------------
// html
function copyhtml() {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist/'))
}
// fonts
function copyfonts() {
  return gulp.src('src/fonts/**/*', { encoding: false })
    .pipe(gulp.dest('dist/fonts/'))
}


// watch & browser sync
// -------------------------------------------------------------------------
function watch() {
  browserSync.init({
    server:  'dist/'
  })
  gulp.watch('src/scss/**/*.scss', styles).on('change', browserSync.reload)
  gulp.watch('src/js/**/*', scripts).on('change', browserSync.reload)
  gulp.watch('src/images/**/*', imageoptim).on('change', browserSync.reload)
  gulp.watch('src/icons/*.svg', iconoptim).on('change', browserSync.reload)
  gulp.watch('src/icons/iconset/*.svg', spriteiconoptim).on('change', browserSync.reload)
  gulp.watch('.temp/iconset/*.svg', sprite).on('change', browserSync.reload)
  gulp.watch('src/fonts/**/*', copyfonts).on('change', browserSync.reload)
  gulp.watch('src/*.html', copyhtml).on('change', browserSync.reload)
}


// build template
// -------------------------------------------------------------------------
const build = gulp.series(
  clean,
  gulp.parallel(styles, scripts, imageoptim, iconoptim, spriteiconoptim, copyhtml, copyfonts),
  sprite,
  watch
)
export default build