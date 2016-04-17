var babel      = require('gulp-babel');
var concat     = require('gulp-concat');
var path       = require('path');

var gn = require('./node_modules/gs-tools/gulp/gulp-node')(__dirname, require('gulp'));
var fileTasks = require('./node_modules/gs-tools/gulp-tasks/file')(require('gulp-concat'));
var karmaTasks = require('./node_modules/gs-tools/gulp-tasks/karma')(
    require('karma').Server);
var mythTasks = require('./node_modules/gs-tools/gulp-tasks/myth')(
    require('gulp-concat'),
    require('gulp-myth'));
var packTasks = require('./node_modules/gs-tools/gulp-tasks/pack')(
    require('vinyl-named'),
    require('gulp-sourcemaps'),
    require('gulp-webpack'));
var tasks = require('./gulptasks');

gn.exec('compile-test', gn.series(
    '_compile',
    gn.parallel(
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

gn.exec('lint', gn.parallel(
    './src/asset:lint',
    './src/common:lint',
    './src/convert:lint',
    './src/data:lint',
    './src/decorator:lint',
    './src/editor:lint',
    './src/generate:lint',
    './src/global:lint',
    './src/helper:lint',
    './src/home:lint',
    './src/image:lint',
    './src/label:lint',
    './src/model:lint',
    './src/navigate:lint',
    './src/partial:lint',
    './src/pipeline:lint',
    './src/render:lint',
    './src/settings:lint',
    './src/template:lint',
    './src/text:lint',
    './src/thirdparty:lint',
    './src/util:lint'
));

var mockAngular = {
  pattern: 'node_modules/gs-tools/src/testing/mock-angular.js',
  included: true
};
gn.exec('test', gn.series(
    '.:compile-test',
    karmaTasks.once(gn, '**', [mockAngular])));
gn.exec('karma', gn.series('.:compile-test', karmaTasks.watch(gn, '**', [mockAngular])));
gn.exec('compile', gn.series('_compile'));

gn.exec('compile-scripts', function() {
  return gn.src(['scripts/**/*.js'])
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(gn.dest('out/scripts'));
  });

gn.exec('compile-ui', gn.series(
    gn.parallel(
        '_compile',
        mythTasks.compile(gn, 'src/**'),
        fileTasks.copy(gn, [
          'node_modules/@angular/router/angular1/angular_1_router.js',
          'src/**/*.ng',
          'src/**/*.html'
        ]),
        function api_() {
          return gn.src(['api/test.js'])
              .pipe(concat('api.js'))
              .pipe(gn.dest('out'));
        }),
    packTasks.app(
        gn,
        ['node_modules/@angular/router/angular1/angular_1_router.js', 'src/app.js'],
        'js.js'),
    packTasks.app(gn, ['src/render/preview-app.js'], 'src/render/js.js')
));


gn.exec('watch', gn.series(
    '.:compile-ui',
    function _watch() {
      gn.watch(['src/**/*'], gn.series('.:compile-ui'));
    }));

gn.exec('watch-test', gn.series(
    '.:compile-test',
    function _watch() {
      gn.watch(['src/**/*.ts'], gn.series('.:compile-test'));
    }));

gn.exec('default', gn.series('compile-ui'));
