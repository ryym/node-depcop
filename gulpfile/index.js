import gulp from 'gulp';
import gutil from 'gulp-util';
import babel from 'gulp-babel';
import rimraf from 'rimraf';
import glob from 'glob';
import eslint from 'eslint';
import ESDoc from 'esdoc/out/src/ESDoc';
import ESDocPublisher from 'esdoc/out/src/Publisher/publish';
import * as $ from './helper';

// -----------------------------------------------
// Main tasks
// -----------------------------------------------

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
  'test'
]);

gulp.task('lint:all', [
  'lint',
  'lint:gulp:fix'
]);

gulp.task('lint', [
  'lint:lib:fix',
  'lint:test:fix',
  'lint:bin:fix'
]);

// -----------------------------------------------
// Build tasks
// -----------------------------------------------

gulp.task('clean', done => {
  rimraf($.GLOB.build, done);
});

gulp.task('build', ['clean'], () => {
  return gulp.src($.GLOB.lib)
    .pipe(babel())
    .pipe(gulp.dest($.PATH.build));
});

gulp.task('watch', ['clean'], () => {
  $.runAndWatch($.GLOB.lib, $.GLOB.lib, path => {
    gutil.log(gutil.colors.cyan('babel:'), path);
    gulp.src(path, { base: $.PATH.lib })
      .pipe(babel())
      .on('error', ex => console.log(ex.stack))
      .pipe(gulp.dest($.PATH.build));
  });
});

// -----------------------------------------------
// Test tasks
// -----------------------------------------------

gulp.task('test', ['build', 'test:prepare'], done => {
  $.runTests($.GLOB.spec).then(err => {
    done(err ? new Error('Mocha tests failed.') : undefined);
  }, done);
});

gulp.task('test:watch', ['test:prepare'], () => {
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
});

gulp.task('test:prepare', () => {
  require('babel-core/register');
});

// -----------------------------------------------
// Lint tasks
// -----------------------------------------------

[
  'bin', 'lib', 'test', 'gulp'
]
.forEach(target => {
  const lintTaskName = `lint:${target}`;

  // Define a lint task.
  gulp.task(lintTaskName, () => {
    const globPattern = $.GLOB[target];
    $.lintFiles([globPattern]);
  });

  // Define a lint task which uses autofix feature.
  gulp.task(`${lintTaskName}:fix`, [
    '_lint:enableFix',
    lintTaskName
  ]);
});

gulp.task('lint:watch', () => {
  const linter = new eslint.CLIEngine();
  function lintAndReport(path) {
    const report = linter.executeOnFiles([path]);
    const formatter = linter.getFormatter();
    console.log(formatter(report.results));
  }

  $.runAndWatch($.GLOB.lib, $.GLOB.lib, lintAndReport);
  $.runAndWatch($.GLOB.test, $.GLOB.test, lintAndReport);
});

gulp.task('_lint:enableFix', () => {
  $.lintFiles.fixEnabled = true;
});

gulp.task('_lint:disallowWarns', () => {
  $.lintFiles.disallowWarns = true;
});

// -----------------------------------------------
// Document tasks
// -----------------------------------------------

gulp.task('doc', () => {
  const config = require('../esdoc.json');
  ESDoc.generate(config, ESDocPublisher);
});
