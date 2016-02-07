var gulp = require('gulp');
var path = require('path');

var LOADED_PATHS = {};

// TODO(gs): Move this to its own package.

function prefixTaskName_(prefix, taskName) {
  if (!!prefix) {
    return prefix + ':' + taskName;
  } else {
    return taskName;
  }
}

function getUniqueTaskName_(name) {
  var parts = name.split(':');
  var package = parts[0];
  var fullpackage = path.resolve(package);
  var prefix = path.relative(path.resolve(path.dirname()), fullpackage);
  var taskName = parts[1];

  if (parts.length < 2) {
    throw Error('Invalid target: ' + name);
  }

  var pathToLoad = package + '/gulpfile';
  if (!LOADED_PATHS[pathToLoad]) {
    require(pathToLoad);
    LOADED_PATHS[pathToLoad] = true;
  }

  return prefixTaskName_(prefix, taskName);
}

function normalizeArgs_(dirname, args) {
  var normalizedArgs = [];
  for (var i = 0; i < args.length; i++) {
    var arg = args[i];
    if (typeof arg === 'string') {
      arg = getUniqueTaskName_(path.join(dirname, arg));
    }
    normalizedArgs.push(arg);
  }
  return normalizedArgs;
}

gulptree = function(dirname) {
  this.dirname_ = dirname;
};

gulptree.prototype.dest = function() {
  return gulp.dest.apply(gulp, arguments);
};

gulptree.prototype.parallel = function() {
  return gulp.parallel.apply(gulp, normalizeArgs_(this.dirname_, arguments));
};

gulptree.prototype.series = function() {
  return gulp.series.apply(gulp, normalizeArgs_(this.dirname_, arguments));
};

gulptree.prototype.src = function() {
  return gulp.src.apply(gulp, arguments);
};

gulptree.prototype.task = function(name, dependencies) {
  var prefix = path.relative(path.resolve(path.dirname()), this.dirname_);
  var uniqueName = prefixTaskName_(prefix, name);
  var task = gulp.task(uniqueName, dependencies);
  return task;
};

gulptree.prototype.watch = function(watchexpr, fn) {
  return gulp.watch(watchexpr, fn);
};

module.exports = function(dirname) {
  return new gulptree(dirname);
};
