import gulp from 'gulp';
import gutil from 'gulp-util';
import babel from 'gulp-babel';
import rimraf from 'rimraf';
import glob from 'glob';
import eslint from 'eslint';
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
  'lint:gulp'
]);

gulp.task('lint', [
  'lint:lib',
  'lint:test',
  'lint:bin'
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

gulp.task('test', ['test:prepare'], done => {
  $.runTests($.GLOB.spec).then(err => {
    done(err ? new Error('Mocha tests failed.') : undefined);
  }, done);
});

gulp.task('test:watch', ['test:prepare'], () => {
  function test() {
    $.runTests($.GLOB.spec, { reporter: 'dot' })
      .catch(ex => console.log(ex.stack));
  }
  const sourceFiles = glob.sync($.GLOB.lib, { realpath: true });

  gulp.watch($.GLOB.lib, () => {
    sourceFiles.forEach(f => $.clearModuleCache(f));
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

gulp.task('lint:lib', () => {
  $.lintFiles([$.GLOB.lib]);
});

gulp.task('lint:test', () => {
  $.lintFiles([$.GLOB.test]);
});

gulp.task('lint:bin', () => {
  $.lintFiles([$.GLOB.bin]);
});

gulp.task('lint:gulp', () => {
  $.lintFiles([$.GLOB.gulp], {
    rules: { 'no-console': 0 }
  });
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

['lib', 'test', 'bin', 'gulp'].forEach(target => {
  gulp.task(`lint:${target}:fix`, [
    '_lint:enableFix',
    `lint:${target}`
  ]);
});

gulp.task('_lint:enableFix', () => {
  $.lintFiles.fixEnabled = true;
});

gulp.task('_lint:disallowWarns', () => {
  $.lintFiles.disallowWarns = true;
});

