var babel   = require('gulp-babel');
var concat  = require('gulp-concat');
var gulp    = require('gulp');
var debug   = require('gulp-debug');
var jasmine = require('gulp-jasmine');
var myth    = require('gulp-myth');
var webpack = require('gulp-webpack');

gulp.task('compile', function() {
  return gulp.src(['src/**/*.js'])
      .pipe(babel())
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

gulp.task('copy-assets', function() {
  return gulp.src(['example/assets/**', '!example/assets/**/*.css'], { base: './example',  })
      .pipe(debug({ title: 'copyNonTexts_' }))
      .pipe(gulp.dest('out'));
});

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
        }),
    function pack_() {
      return gulp.src(['out/app.js'])
          .pipe(webpack({
            output: { filename: 'js.js' }
          }))
          .pipe(gulp.dest('out'));
    }
));

gulp.task('ui', gulp.parallel('compile-ui', 'copy-assets'));

gulp.task('watch', function () {
  gulp.watch(['src/**/*'], gulp.series('compile-ui'));
});

gulp.task('watch-test', function () {
  gulp.watch(['src/**/*.js'], gulp.series('test'));
});

gulp.task('default', gulp.task('compile'));
