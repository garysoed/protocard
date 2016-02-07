var gulp = require('gulp');
var karma = require('karma').Server;
var named = require('vinyl-named');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');
var webpack = require('gulp-webpack');

var tasks = {};
tasks.compile = function() {
  return function() {
    var tsProject = typescript.createProject('tsconfig.json');
    return tsProject.src()
        .pipe(typescript(tsProject))
        .pipe(gulp.dest('out'));
  };
};

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
  gt.task('_compile-test', tasks.compileTest(gt, outdir));

  gt.exec('compile-test', gt.series('_compile', '.:_compile-test'));
  gt.exec('test', gt.series('_compile', '.:_compile-test', tasks.test(gt, outdir)));
  gt.exec('karma', gt.series('_compile', '.:_compile-test', tasks.karma(gt, outdir)));
};

// TODO(gs): global tasks.
gulp.task('_compile', tasks.compile());

module.exports = tasks;
