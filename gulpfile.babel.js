import gulp from 'gulp';
import gutil from 'gulp-util';
import babel from 'gulp-babel';
import rimraf from 'rimraf';
import glob from 'glob';
import Mocha from 'mocha';
import eslint from 'eslint';

const PATH = {
  lib: './lib',
  build: './build',
  test: './test'
};

const GLOB = {
  bin: './bin/**/*',
  lib: `${PATH.lib}/**/*.js`,
  build: `${PATH.build}/**/*`,
  test: `${PATH.test}/**/*.js`,
  spec: `${PATH.test}/**/*.spec.js`
};

// -----------------------------------------------
// Tasks
// -----------------------------------------------

gulp.task('clean', done => {
  rimraf(GLOB.build, done);
});

gulp.task('build', ['clean'], () => {
  return gulp.src(GLOB.lib)
    .pipe(babel())
    .pipe(gulp.dest(PATH.build));
});

gulp.task('watch', ['clean'], () => {
  runAndWatch(GLOB.lib, GLOB.lib, path => {
    gutil.log(gutil.colors.cyan('babel:'), path);
    gulp.src(path, { base: PATH.lib })
      .pipe(babel())
      .on('error', ex => console.log(ex.stack))
      .pipe(gulp.dest(PATH.build));
  });
});

gulp.task('test:prepare', () => {
  require('babel-core/register');
});

gulp.task('test', ['test:prepare'], done => {
  runTests(GLOB.spec).then(err => {
    done(err ? new Error('Mocha tests failed.') : undefined);
  }, done);
});

gulp.task('test:watch', ['test:prepare'], () => {
  function test() {
    runTests(GLOB.spec, { reporter: 'dot' })
      .catch(ex => console.log(ex.stack));
  }
  const sourceFiles = glob.sync(GLOB.lib, { realpath: true });
  gulp.watch(GLOB.lib, () => {
    sourceFiles.forEach(f => clearModuleCache(f));
    test();
  });
  runAndWatch(GLOB.spec, null, () => test());
});

gulp.task('lint:lib', () => {
  lintFiles([GLOB.lib]);
});

gulp.task('lint:test', () => {
  lintFiles([GLOB.test]);
});

gulp.task('lint:bin', () => {
  lintFiles([GLOB.bin]);
});

gulp.task('lint:gulp', () => {
  lintFiles([__filename], {
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
  runAndWatch(GLOB.lib, GLOB.lib, lintAndReport);
  runAndWatch(GLOB.test, GLOB.test, lintAndReport);
});

gulp.task('_lint:enableFix', () => {
  lintFiles.fixEnabled = true;
});

['lib', 'test', 'bin', 'gulp'].forEach(target => {
  gulp.task(`lint:${target}:fix`, [
    '_lint:enableFix',
    `lint:${target}`
  ]);
});

gulp.task('_lint:disallowWarns', () => {
  lintFiles.disallowWarns = true;
});

gulp.task('lint', [
  'lint:lib',
  'lint:test',
  'lint:bin'
]);

gulp.task('lint:all', [
  'lint',
  'lint:gulp'
]);

gulp.task('check', [
  'lint:all',
  'test'
]);

gulp.task('check:strict', [
  '_lint:disallowWarns',
  'check'
]);

gulp.task('default', [
  'lint:watch',
  'test:watch'
]);

// -----------------------------------------------
// Helper functions
// -----------------------------------------------

/**
 * Clear module cache.
 */
function clearModuleCache(path) {
  delete require.cache[path];
}

/**
 * Run tests in the specified file pattern using Mocha.
 */
function runTests(pattern, options) {
  const mocha = new Mocha(options);
  const files = glob.sync(pattern, { realpath: true });
  files.forEach(file => {
    clearModuleCache(file);  // For watching
    mocha.addFile(file);
  });
  return new Promise((resolve, reject) => {
    try {
      mocha.run(resolve);
    }
    catch (ex) {
      reject(ex);
    }
  });
}

/**
 * Run a given task. And re-run it whenever the specified files change.
 */
function runAndWatch(watchPattern, initialValue, task) {
  gulp.watch(watchPattern, event => {
    task(event.path, event);
  });
  return task(initialValue);
}

/**
 * Lint the specified files using eslint.
 */
function lintFiles(pattern, configs) {
  const linter = new eslint.CLIEngine(
    Object.assign({ fix: lintFiles.fixEnabled }, configs)
  );
  const report = linter.executeOnFiles(pattern);
  const formatter = linter.getFormatter();
  console.log(formatter(report.results));

  if (lintFiles.fixEnabled) {
    eslint.CLIEngine.outputFixes(report);
  }

  const strict = lintFiles.disallowWarns;
  if (report.errorCount > 0 || (strict && report.warningCount > 0)) {
    throw new Error('eslint reports some problems.');
  }
}
lintFiles.disallowWarns = false;
lintFiles.fixEnabled = false;
