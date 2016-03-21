import path from 'path';
import gulp from 'gulp';
import gutil from 'gulp-util';
import gulpBabel from 'gulp-babel';
import rimraf from 'rimraf';
import glob from 'glob';
import eslint from 'eslint';
import ESDoc from 'esdoc/out/src/ESDoc';
import ESDocPublisher from 'esdoc/out/src/Publisher/publish';
import * as $ from './helper';

/**
 * @fileoverview
 * This file defines the core tasks executed by gulp.
 * All tasks must be curried to allow clients to pass options.
 */

/**
 * The object to store any state about tasks.
 */
export const state = {};

// -----------------------------------------------
// Build tasks
// -----------------------------------------------

export const clean = () => done => {
  rimraf($.GLOB.build, done);
};

export const babel = () => () => {
  return gulp.src($.GLOB.lib)
    .pipe(gulpBabel())
    .pipe(gulp.dest($.PATH.build));
};

export const babelWatch = () => () => {
  $.runAndWatch($.GLOB.lib, $.GLOB.lib, path => {
    gutil.log(gutil.colors.cyan('babel:'), path);
    gulp.src(path, { base: $.PATH.lib })
      .pipe(gulpBabel())
      .on('error', ex => console.log(ex.stack))
      .pipe(gulp.dest($.PATH.build));
  });
};

// -----------------------------------------------
// Test tasks
// -----------------------------------------------

export const test = () => done => {
  $.runTests($.GLOB.spec).then(err => {
    done(err ? new Error('Mocha tests failed.') : undefined);
  }, done);
};

export const testWatch = () => () => {
  function test() {
    $.runTests(
      $.GLOB.spec,
      { reporter: 'dot' },
      { ignore: '**/bin/*.js' }
    )
    .catch(ex => console.log(ex.stack));
  }

  const sourceFiles = glob.sync($.GLOB.lib, {
    realpath: true
  });
  const helperFiles = glob.sync($.GLOB.test, {
    realpath: true,
    ignore: '**/*.spec.js'
  });

  gulp.watch([$.GLOB.lib, $.GLOB.test], event => {
    if (event.path.endsWith('.spec.js')) {
      return;
    }
    sourceFiles.forEach(f => $.clearModuleCache(f));
    helperFiles.forEach(f => $.clearModuleCache(f));
    test();
  });

  $.runAndWatch($.GLOB.spec, null, () => test());
};

export const testPrepare = () => () => {
  require('babel-core/register');
};

// -----------------------------------------------
// Lint tasks
// -----------------------------------------------

export const lint = (target, options = {}) => () => {
  const { fix } = options;
  const globPattern = $.GLOB[target];
  $.lintFiles([globPattern], { fix }, state.disallowWarns);
};

export const lintWatch = targets => () => {
  const linter = new eslint.CLIEngine();

  function lintAndReport(path) {
    const report = linter.executeOnFiles([path]);
    const formatter = linter.getFormatter();
    console.log(formatter(report.results));
  }

  targets.forEach(globPattern => {
    $.runAndWatch(globPattern, globPattern, lintAndReport);
  });
};

export const depcop = () => () => {

  // Don't load 'depcop' at the top level
  // because the source code may be unstable.
  const libraryPath = path.resolve($.ROOT_DIR, 'build');
  const { makeDepcop } = require(libraryPath);

  const depcop = makeDepcop();
  const result = depcop.runValidations();

  if (result.warningCount > 0) {
    const format = depcop.getFormatter();
    console.log(format(result));
    throw new Error('depcop warned some dependencies');
  }
};

// -----------------------------------------------
// Document tasks
// -----------------------------------------------

export const esdoc = () => () => {
  const config = require(`${$.ROOT_DIR}/esdoc.json`);
  ESDoc.generate(config, ESDocPublisher);
};
