var gulp = require('gulp'),
  del = require('del'),
  sass = require('gulp-sass')(require('sass')),
  rename = require('gulp-rename'),
  cleancss = require('gulp-clean-css'),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  babel = require('gulp-babel'),
  concat = require('gulp-concat'),
  terser = require('gulp-terser'),
  imagemin = require('gulp-imagemin'),
  svgSprite = require('gulp-svg-sprite'),
  browsersync = require('browser-sync').create()


// file paths
// -------------------------------------------------------------------------
var paths = {
  watchstyles: {
    src: 'src/scss/**/*.scss',
  },
  styles: {
    src: 'src/scss/main.scss',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'dist/js/'
  },
  images: {
    src: 'src/images/**/*',
    dest: 'dist/images/'
  },
  icons: {
    src: 'src/icons/*.svg',
    dest: 'dist/icons/'
  },
  spriteicons: {
    src: 'src/icons/iconset/*.svg',
    dest: 'dist/icons/'
  },
  html: {
    src: 'src/*.html'
  },
  fonts: {
    src: 'src/fonts/**/*',
    dest: 'dist/fonts/'
  }
}


// clean up folders
// -------------------------------------------------------------------------
function clean() {
  return del([
    'src/.temp/*',
    'dist/*'
  ])
}


// compile scss to css, compress ...
// -------------------------------------------------------------------------
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleancss())
    .pipe(rename({
      basename: 'all',
      suffix: '.min'
    }))
    // .pipe(sourcemaps.write(''))
    .pipe(gulp.dest(paths.styles.dest))
}


// concatenates and uglifies js
// -------------------------------------------------------------------------
function scripts() {
  return gulp.src([
    'src/js/title.js',
    'src/js/accordion.js',
    'src/js/year.js'
  ])
    .pipe(babel())
    .pipe(terser())
    .pipe(concat('bundle.min.js'))
    .pipe(gulp.dest(paths.scripts.dest))
}


// image optimization
// -------------------------------------------------------------------------
function imageoptim() {
  return gulp.src(paths.images.src)
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({
        progressive: true,
        quality: 60
      }),
      imagemin.optipng({optimizationLevel: 5}),
    ]))
    .pipe(gulp.dest(paths.images.dest))
}


// icon optimization to .temp folder
// -------------------------------------------------------------------------
function iconoptim() {
  return gulp.src(paths.icons.src)
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({ plugins: [
        { removeViewBox: false },
        { removeTitle: false },
        { cleanupIDs: false }
      ] })
    ]))
    .pipe(gulp.dest('src/.temp/'))
}
// icon sprite
function spriteiconoptim() {
  return gulp.src(paths.spriteicons.src)
    .pipe(imagemin([
      imagemin.svgo({ plugins: [
        { removeViewBox: false },
        { removeTitle: false },
        { cleanupIDs: false }
      ] })
    ]))
    .pipe(gulp.dest('src/.temp/iconset/'))
}


// compile svg files frrom .temp folder to svg sprite
// -------------------------------------------------------------------------
function sprite() {
  return gulp.src([
    'src/.temp/iconset/*.svg'
  ])
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
    .pipe(gulp.dest(paths.icons.dest))
}


// copy files
// -------------------------------------------------------------------------
// html
function copyhtml() {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest('dist/'))
}
// fonts
function copyfonts() {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
}
// optimized icons from .temp folder
function copyicons() {
  return gulp.src([
    'src/.temp/*.svg'
  ])
    .pipe(gulp.dest(paths.icons.dest))
}


// watch & browser sync
// -------------------------------------------------------------------------
function watch() {
  browsersync.init({
    server:  'dist/'
  })
  gulp.watch(paths.watchstyles.src, styles).on('change', browsersync.reload)
  gulp.watch(paths.styles.src, styles).on('change', browsersync.reload)
  gulp.watch(paths.scripts.src, scripts).on('change', browsersync.reload)
  gulp.watch(paths.images.src, imageoptim).on('change', browsersync.reload)
  gulp.watch(paths.icons.src, iconoptim).on('change', browsersync.reload)
  gulp.watch(paths.spriteicons.src, spriteiconoptim).on('change', browsersync.reload)
  gulp.watch(paths.html.src, copyhtml).on('change', browsersync.reload)
  gulp.watch(paths.fonts.src, copyfonts).on('change', browsersync.reload)
  gulp.watch('*.html').on('change', browsersync.reload)
}


// build
// -------------------------------------------------------------------------
var build = gulp.series(clean, gulp.parallel(styles, scripts), gulp.parallel(imageoptim, iconoptim, spriteiconoptim, copyhtml, copyfonts), copyicons, sprite, watch)

exports.default = build