var babel      = require('gulp-babel');
var concat     = require('gulp-concat');
var gulp       = require('gulp');
var debug      = require('gulp-debug');
var insert     = require('gulp-insert');
var jasmine    = require('gulp-jasmine');
var karma      = require('karma').Server;
var myth       = require('gulp-myth');
var named      = require('vinyl-named');
var path       = require('path');
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

gulp.task('compile-test', gulp.series(
    'compile',
    function _packTests() {
      return gulp.src(['out/**/*_test.js'])
          .pipe(named(function(file) {
            var filepath = file.path;
            return path.join(
                path.dirname(filepath),
                path.basename(filepath, path.extname(filepath)) + '_pack'
            );
          }))
          .pipe(sourcemaps.init())
          .pipe(webpack())
          .pipe(sourcemaps.write('./', { includeContent: true }))
          .pipe(gulp.dest('.'));
    }
))

gulp.task('test', gulp.series(
    'compile-test',
    function runTests_(done) {
      new karma({
        configFile: __dirname + '/karma.conf.js',
        reporters: ['story'],
        storyReporter: {
          showSkipped:        true, // default: false
          showSkippedSummary: true  // default: false
        },
        singleRun: true
      }, done).start();
    }
));

gulp.task('karma', function(done) {
  new karma({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, done).start();
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
  gulp.watch(['src/**/*.ts'], gulp.series('compile-test'));
});

gulp.task('default', gulp.task('compile'));
