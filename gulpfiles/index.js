/* eslint-disable no-var, prefer-arrow-callback */

var path = require('path');
var gulp = require('gulp');
var gulpBabel = require('gulp-babel');
var rimraf = require('rimraf');
var defineTasks = require('./defineTasks');

/**
 * Compile the core task file written in ES2015.
 * We can use all main tasks after this task compiles them.
 */
gulp.task('update', function() {
  var lib = path.join(__dirname, 'lib');
  var dest = path.join(__dirname, 'build');

  rimraf.sync(dest);
  return gulp.src(lib + '/**/*.js')
    .pipe(gulpBabel())
    .pipe(gulp.dest(dest));
});

var tasks = loadTasks();

if (tasks !== undefined) {
  defineTasks(tasks);
}

/**
 * Load compiled tasks. If called before they are compiled,
 * return undefined.
 * @private
 */
function loadTasks() {
  try {
    var tasks = require('./build/tasks');
    tasks.helpers = require('./build/helper');
    return tasks;
  }
  catch (ex) {

    // When the gulpfile loaded first,
    // tasks hasn't been built yet.
  }
}
