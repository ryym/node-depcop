import assign from 'lodash.assign';
import { makeIgnorePatternChecker } from './helper';

/**
 * @typedef {Object} UnusedCheckOptions
 * @property {string[]} ignore The patterns of module names
 *     which should be ignored.
 * @property {boolean} dependencies Whether or not
 *     the `dependencies` should be checked.
 * @property {boolean} devDependencies Whether or not
 *     the `devDependencies` should be checked.
 */

/**
 * Find unused modules (Curried).
 * The 'unused module' is a module which is listed in
 * `dependencies` or `devDependencies` but used in nowhere.
 * @name findUnusedModule
 * @param {PackageJson} packageJson
 * @param {Function} makeReporter
 * @param {UnusedCheckOptions} userOptions
 * @param {ImportedModules[]} modules
 * @return {Object}
 */
export default (packageJson, makeReporter, userOptions) => modules => {
  const options = mergeOptions(userOptions);
  const report = makeReporter('unused', 'Unused modules');

  const moduleMap = modules.reduce((map, module) => {
    map[module.getName()] = module;
    return map;
  }, {});
  const pkgFile = packageJson.getFileInfo();
  const isTarget = makeIgnorePatternChecker(options.ignore);

  if (options.dependencies) {
    const deps = packageJson.get('dependencies');
    Object.keys(deps).forEach(dep => {
      if (isTarget(dep) && ! moduleMap.hasOwnProperty(dep)) {
        report.addDep(dep, [pkgFile]);
      }
    });
  }

  if (options.devDependencies) {
    const devDeps = packageJson.get('devDependencies');
    Object.keys(devDeps).forEach(dep => {
      if (isTarget(dep) && ! moduleMap.hasOwnProperty(dep)) {
        report.addDevDep(dep, [pkgFile]);
      }
    });
  }

  return report;
};

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
