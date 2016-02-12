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
var tasks = require('./gulptasks');

gt.exec('compile-test', gt.series(
    '_compile',
    gt.parallel(
        './src/asset:_compile-test',
        './src/common:_compile-test',
        './src/convert:_compile-test',
        './src/data:_compile-test',
        './src/decorator:_compile-test',
        './src/editor:_compile-test',
        './src/generate:_compile-test',
        './src/global:_compile-test',
        './src/helper:_compile-test',
        './src/home:_compile-test',
        './src/image:_compile-test',
        './src/label:_compile-test',
        './src/model:_compile-test',
        './src/navigate:_compile-test',
        './src/partial:_compile-test',
        './src/pipeline:_compile-test',
        './src/render:_compile-test',
        './src/settings:_compile-test',
        './src/template:_compile-test',
        './src/text:_compile-test',
        './src/thirdparty:_compile-test',
        './src/util:_compile-test'
    )));

gt.exec('test', gt.series('.:compile-test', tasks.test(gt, 'out/**')));
gt.exec('karma', gt.series('.:compile-test', tasks.karma(gt, 'out/**')));
gt.exec('compile', gt.series('_compile'));

gt.exec('compile-ui', gt.series(
    gt.parallel(
        '_compile',
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


gt.exec('watch', function() {
  gt.watch(['src/**/*'], gt.series('.:compile-ui'));
});

gt.exec('watch-test', function() {
  gt.watch(['src/**/*.ts'], gt.series('.:compile-test'));
});

gt.exec('default', gt.exec('compile-ui'));
