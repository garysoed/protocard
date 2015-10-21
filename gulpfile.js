var babel   = require('gulp-babel');
var gulp    = require('gulp');
var debug   = require('gulp-debug');
var jasmine = require('gulp-jasmine');
var webpack = require('gulp-webpack');

gulp.task('compile', function() {
  return gulp.src(['src/**/*.js'])
      .pipe(babel())
      .pipe(gulp.dest('out'));
});

gulp.task('test', gulp.series(
  'compile',
  function _runTests() {
    return gulp.src(['out/**/*_test.js'])
        .pipe(jasmine({
          includeStackTrace: true
        }));
  }
));

gulp.task('copy-assets', function() {
  return gulp.src(['example/assets/**', '!example/assets/**/*.css'], { base: './example',  })
      .pipe(debug({ title: 'copyNonTexts_' }))
      .pipe(gulp.dest('out'));
});

gulp.task('ui', gulp.series(
    'compile',
    'copy-assets',
    function _ng() {
      return gulp.src(['src/**/*.ng'])
          .pipe(gulp.dest('out'));
    },
    function _pack() {
      return gulp.src(['out/app.js'])
          .pipe(webpack({
            output: { filename: 'js.js' }
          }))
          .pipe(gulp.dest('out'));
    }
));

gulp.task('default', gulp.task('compile'));
