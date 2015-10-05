var babel = require('gulp-babel');
var gulp = require('gulp');
var jasmine = require('gulp-jasmine');

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
))
