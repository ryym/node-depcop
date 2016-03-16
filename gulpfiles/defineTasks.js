/* eslint-disable no-var, prefer-arrow-callback */

var gulp = require('gulp');

/**
 * Define main gulp tasks. This function just
 * re-defines each task as a gulp task
 * and specifies their dependencies.
 */
module.exports = function defineTasks(tasks) {
  var $ = tasks.helpers;

  gulp.task('default', [
    'lint:watch',
    'test:watch'
  ]);

  gulp.task('check:strict', [
    '_lint:disallowWarns',
    'check'
  ]);

  gulp.task('check', [
    'lint:all',
    'test',
    'doc'
  ]);

  gulp.task('lint:all', [
    'lint',
    'lint:gulp:fix',
    'depcop'
  ]);

  gulp.task('lint', [
    'lint:lib:fix',
    'lint:test:fix',
    'lint:bin:fix'
  ]);


  gulp.task('clean', tasks.clean());

  gulp.task('build', [
    'clean'
  ], tasks.babel());

  gulp.task('watch', [
    'clean'
  ], tasks.babelWatch());


  gulp.task('test', [
    'build',
    'test:prepare'
  ], tasks.test());

  gulp.task('test:watch', [
    'test:prepare'
  ], tasks.testWatch());

  gulp.task('test:prepare', tasks.testPrepare());


  // Define `lint` and `lint:fix` tasks for each targets.
  ['bin', 'lib', 'test', 'gulp' ].forEach(function(target) {
    const lintTaskName = 'lint:' + target;

    gulp.task(lintTaskName, tasks.lint(target));
    gulp.task(lintTaskName + ':fix', tasks.lint(
      target, { fix: true }
    ));
  });

  gulp.task('lint:watch', tasks.lintWatch([
    $.GLOB.lib, $.GLOB.test
  ]));


  gulp.task('depcop', [
    'build'
  ], tasks.depcop());

  gulp.task('doc', tasks.esdoc());
};
