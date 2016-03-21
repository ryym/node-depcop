import assign from 'lodash.assign';
import { makeIgnorePatternChecker } from './helper';

/**
 * @typedef {Object} MissingCheckOptions
 * @property {string[]} ignore The patterns of module names
 *     which should be ignored.
 * @property {boolean} dependencies Whether or not
 *     the `dependencies` should be checked.
 * @property {boolean} devDependencies Whether or not
 *     the `devDependencies` should be checked.
 */

/**
 * Find missing modules from imported modules (Curried).
 * The 'missing module' is a module which is used in source code
 * but not listed in `dependencies` nor `devDependencies`.
 * @name findMissingModules
 * @param {PackageJson} packageJson
 * @param {Function} makeReporter
 * @param {MissingCheckOptions} userOptions
 * @param {ImportedModules[]} modules
 * @return {Object}
 */
export default (packageJson, makeReporter, userOptions) => modules => {
  const options = mergeOptions(userOptions);
  const report = makeReporter('missing', 'Missing modules');
  const isTarget = makeIgnorePatternChecker(options.ignore);

  modules.forEach(m => {
    const name = m.getName();

    if (isDefinedIn(packageJson, name) || ! isTarget(name)) {
      return;
    }

    const dependents = m.getDependents();
    const usedInLib = m.isUsedInLibSource();

    if (options.dependencies && usedInLib) {
      report.addDep(name, dependents);
    }
    if (options.devDependencies && ! usedInLib) {
      report.addDevDep(name, dependents);
    }
  });

  return report;
};

function isDefinedIn(packageJson, name) {
  return packageJson.hasDep(name)
    || packageJson.hasDevDep(name)
    || packageJson.hasPeerDep(name);
}

/**
 * Merge the specified options with the default options.
 * @private
 */
function mergeOptions(userOptions) {
  return assign({
    dependencies: true,
    devDependencies: true,
    ignore: []
  }, userOptions);
}
