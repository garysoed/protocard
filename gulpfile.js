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

var gt = require('./gulptree/main')(__dirname);
var tests = require('./gulptasks');

gt.task('compile-test', gt.parallel(
    './src/asset:compile-test',
    './src/common:compile-test',
    './src/convert:compile-test',
    './src/data:compile-test',
    './src/decorator:compile-test',
    './src/editor:compile-test',
    './src/generate:compile-test',
    './src/global:compile-test',
    './src/helper:compile-test',
    './src/home:compile-test',
    './src/image:compile-test',
    './src/label:compile-test',
    './src/model:compile-test',
    './src/navigate:compile-test',
    './src/partial:compile-test',
    './src/pipeline:compile-test',
    './src/render:compile-test',
    './src/settings:compile-test',
    './src/template:compile-test',
    './src/text:compile-test',
    './src/thirdparty:compile-test',
    './src/util:compile-test'
));

gt.task('test', gt.series('.:compile-test', tests.test(gt, 'out/**')));
gt.task('karma', gt.series('.:compile-test', tests.karma(gt, 'out/**')));

gt.task('compile',
    function ts_() {
      var tsProject = typescript.createProject('tsconfig.json');
      return tsProject.src()
          .pipe(typescript(tsProject))
          .pipe(gt.dest('out'));
    });

// gulp.task('compile-test', gulp.series(
//     'compile',
//     function _packTests() {
//       return gulp.src(['out/**/*_test.js'])
//           .pipe(named(function(file) {
//             var filepath = file.path;
//             return path.join(
//                 path.dirname(filepath),
//                 path.basename(filepath, path.extname(filepath)) + '_pack'
//             );
//           }))
//           .pipe(sourcemaps.init())
//           .pipe(webpack())
//           .pipe(sourcemaps.write('./', { includeContent: true }))
//           .pipe(gulp.dest('.'));
//     }
// ))
//
// gulp.task('test', gulp.series(
//     'compile-test',
//     function runTests_(done) {
//       new karma({
//         configFile: __dirname + '/karma.conf.js',
//         reporters: ['story'],
//         storyReporter: {
//           showSkipped:        true, // default: false
//           showSkippedSummary: true  // default: false
//         },
//         singleRun: true
//       }, done).start();
//     }
// ));
//
// gulp.task('karma', function(done) {
//   new karma({
//     configFile: __dirname + '/karma.conf.js',
//     singleRun: false
//   }, done).start();
// });

gt.task('compile-ui', gt.series(
    gt.parallel(
        '.:compile',
        function css_() {
          return gt.src(['src/**/*.css'])
              .pipe(myth())
              .pipe(concat('css.css'))
              .pipe(gt.dest('out'));
        },
        function ng_() {
          return gt.src(['src/**/*.ng'])
              .pipe(gt.dest('out'));
        },
        function api_() {
          return gt.src(['api/test.js'])
              .pipe(concat('api.js'))
              .pipe(gt.dest('out'));
        },
        function subPages_() {
          return gt.src(['src/**/*.html'])
              .pipe(gt.dest('out'));
        }),
    function packApp_() {
      return gt.src(['out/app.js'])
          .pipe(sourcemaps.init())
          .pipe(webpack({
            output: {
              filename: 'js.js'
            }
          }))
          .pipe(sourcemaps.write('./', { includeContent: true }))
          .pipe(gt.dest('out'));
    },
    function packRender_() {
      return gt.src(['out/render/preview-app.js'])
          .pipe(sourcemaps.init())
          .pipe(webpack({
            output: {
              filename: 'js.js'
            }
          }))
          .pipe(sourcemaps.write('./', { includeContent: true }))
          .pipe(gt.dest('out/render'));
    }
));

gt.task('compile-scripts', function() {
  return gt.src(['scripts/**/*.js'])
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(gt.dest('out/scripts'));
});

gt.task('ui', gt.parallel('.:compile-ui'));

gt.task('watch', function () {
  gt.watch(['src/**/*'], gt.series('.:compile-ui'));
});

gt.task('watch-test', function () {
  gt.watch(['src/**/*.ts'], gt.series('.:compile-test'));
});

gt.task('default', gt.task('compile'));
