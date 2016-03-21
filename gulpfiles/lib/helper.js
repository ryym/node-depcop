import path from 'path';
import gulp from 'gulp';
import glob from 'glob';
import Mocha from 'mocha';
import eslint from 'eslint';

/**
 * The root directory of this repository.
 */
export const ROOT_DIR = path.resolve(__dirname, '../../');

/**
 * Common paths used in tasks.
 */
export const PATH = {
  lib: 'lib',
  build: 'build',
  test: 'test'
};

/**
 * Common glob patterns used in tasks.
 */
export const GLOB = {
  bin: 'bin/**/*',
  lib: `${PATH.lib}/**/*.js`,
  build: `${PATH.build}/**/*`,
  test: `${PATH.test}/**/*.js`,
  spec: `${PATH.test}/**/*.spec.js`,
  gulp: 'gulpfiles/**/*.js'
};

/**
 * Clear module cache.
 * @param {string} path - A path of module to be cleared.
 * @return {void}
 */
export function clearModuleCache(path) {
  delete require.cache[path];
}

/**
 * Run tests in the specified file pattern using Mocha.
 * @param {string} pattern
 * @param {Object} options - The options for Mocha.
 * @param {Object} globOptions - The options for glob.
 * @return {Promise} Rejected if any runtime error occurred.
 */
export function runTests(pattern, options, globOptions) {
  const mocha = new Mocha(options);
  const files = glob.sync(pattern, Object.assign(
    { realpath: true }, globOptions
  ));

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
 * Run a given task. And re-run it whenever any file changes.
 * @param {string} watchPattern
 * @param {*} initialValue - Passed to 'task' when it is called first.
 * @param {Function} task - A function which takes a changed path
 *     and the event object.
 * @return {void}
 */
export function runAndWatch(watchPattern, initialValue, task) {
  gulp.watch(watchPattern, event => {
    task(event.path, event);
  });
  return task(initialValue);
}

/**
 * Lint the specified files using ESLint.
 * @param {string} pattern
 * @param {Object} options - The options for ESLint.
 * @param {boolean} disallowWarns - Whether or not
 *     one or more warnings should throw an error.
 * @return {void}
 */
export function lintFiles(pattern, options, disallowWarns) {
  const linter = new eslint.CLIEngine(options);
  const formatter = linter.getFormatter();
  const report = linter.executeOnFiles(pattern);

  console.log(formatter(report.results));

  if (options.fix) {
    eslint.CLIEngine.outputFixes(report);
  }

  const { errorCount, warningCount } = report;
  if (errorCount > 0 || disallowWarns && warningCount > 0) {
    throw new Error('ESLint reports some problems.');
  }
}
