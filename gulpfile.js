var babel      = require('gulp-babel');
var concat     = require('gulp-concat');
var gulp       = require('gulp');
var debug      = require('gulp-debug');
var insert     = require('gulp-insert');
var jasmine    = require('gulp-jasmine');
var myth       = require('gulp-myth');
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');
var webpack    = require('gulp-webpack');

gulp.task('compile',
    function ts_() {
      var tsProject = typescript.createProject('tsconfig.json');
      return tsProject.src()
          .pipe(typescript(tsProject))
          .pipe(gulp.dest('out'));
    });

gulp.task('test', gulp.series(
    'compile',
    function runTests_() {
      return gulp.src(['out/**/*_test.js'])
          .pipe(jasmine({
            includeStackTrace: true
          }));
    }
));

gulp.task('compile-ui', gulp.series(
    gulp.parallel(
        'compile',
        function css_() {
          return gulp.src(['src/**/*.css'])
              .pipe(myth())
              .pipe(concat('css.css'))
              .pipe(gulp.dest('out'));
        },
        function ng_() {
          return gulp.src(['src/**/*.ng'])
              .pipe(gulp.dest('out'));
        },
        function api_() {
          return gulp.src(['api/test.js'])
              .pipe(concat('api.js'))
              .pipe(gulp.dest('out'));
        },
        function subPages_() {
          return gulp.src(['src/**/*.html'])
              .pipe(gulp.dest('out'));
        }),
    function packApp_() {
      return gulp.src(['out/app.js'])
          .pipe(sourcemaps.init())
          .pipe(webpack({
            output: {
              filename: 'js.js'
            }
          }))
          .pipe(sourcemaps.write('./', { includeContent: true }))
          .pipe(gulp.dest('out'));
    },
    function packRender_() {
      return gulp.src(['out/render/preview-app.js'])
          .pipe(sourcemaps.init())
          .pipe(webpack({
            output: {
              filename: 'js.js'
            }
          }))
          .pipe(sourcemaps.write('./', { includeContent: true }))
          .pipe(gulp.dest('out/render'));
    }
));

gulp.task('compile-scripts', function() {
  return gulp.src(['scripts/**/*.js'])
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(gulp.dest('out/scripts'));
});

gulp.task('ui', gulp.parallel('compile-ui'));

gulp.task('watch', function () {
  gulp.watch(['src/**/*'], gulp.series('compile-ui'));
});

gulp.task('watch-test', function () {
  gulp.watch(['src/**/*.ts'], gulp.series('test'));
});

gulp.task('default', gulp.task('compile'));
