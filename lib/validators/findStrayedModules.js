import assign from 'lodash.assign';

/**
 * @typedef {Object} StrayedCheckOptions
 * @property {boolean} dependencies Whether or not
 *     the `dependencies` should be checked.
 * @property {boolean} devDependencies Whether or not
 *     the `devDependencies` should be checked.
 */

/**
 * Find modules which are listed in wrong group (Curried).
 * The 'strayed module' is a module which is used in a wrong place.
 * There is two patterns of straying:
 *   * A module defined in `dependencies` is used only in development code.
 *   * A module defined in `devDependencies` is used in library code.
 * @name findStrayedModules
 * @param {PackageJson} packageJson
 * @param {Function} makeReporter
 * @param {StrayedCheckOptions} userOptions
 * @param {ImportedModules[]} modules
 * @return {Object}
 */
export default (packageJson, makeReporter, userOptions) => modules => {
  const options = mergeOptions(userOptions);
  const report = makeReporter('strayed', 'Modules in wrong group');

  modules.forEach(m => {
    const name = m.getName();
    const dependents = m.getDependents();

    if (
      options.dependencies
      && packageJson.hasDep(name)
      && isUsedOnlyInDevSource(m)
    ) {
      report.addDep(name, dependents);
    }

    if (
      options.devDependencies
      && packageJson.hasDevDep(name)
      && m.isUsedInLibSource(m)
    ) {
      report.addDevDep(name, dependents);
    }
  });

  return report;
};

function isUsedOnlyInDevSource(module) {
  return module.isUsedInDevSource() && ! module.isUsedInLibSource();
}

function mergeOptions(userOptions) {
  return assign({
    dependencies: true,
    devDependencies: true
  }, userOptions);
}
