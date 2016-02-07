var karma      = require('karma').Server;
var named      = require('vinyl-named');
var path       = require('path');
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');
var webpack    = require('gulp-webpack');

var tasks = {};
tasks.compileTest = function(gt, outdir) {
  return function compileTest_() {
    return gt.src([path.join(outdir, '*_test.js')])
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
        .pipe(gt.dest('.'));
  };
};

tasks.test = function(gt, outdir) {
  return function runTests_(done) {
    new karma({
      configFile: __dirname + '/karma.conf.js',
      files: [
        { pattern: path.join(outdir, '*_test_pack.js'), included: true }
      ],
      reporters: ['story'],
      storyReporter: {
        showSkipped:        true, // default: false
        showSkippedSummary: true  // default: false
      },
      singleRun: true
    }, done).start();
  };
};

tasks.karma = function(gt, outdir) {
  return function(done) {
    new karma({
      configFile: __dirname + '/karma.conf.js',
      files: [
        { pattern: path.join(outdir, '*_test_pack.js'), included: true }
      ],
      singleRun: false
    }, done).start();
  };
};

tasks.allTests = function(gt, outdir) {
  gt.task('compile-test', tasks.compileTest(gt, outdir));
  gt.task('test', gt.series('.:compile-test', tasks.test(gt, outdir)));
  gt.task('karma', gt.series('.:compile-test', tasks.karma(gt, outdir)));
};

module.exports = tasks;
