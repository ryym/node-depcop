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
      && isUsedOnlyInDevSource(m)
      && shouldBeUsedInLibSource(name, packageJson)
    ) {
      report.addDep(name, dependents);
    }

    if (
      options.devDependencies
      && m.isUsedInLibSource(m)
      && shouldBeUsedOnlyInDevSource(name, packageJson)
    ) {
      report.addDevDep(name, dependents);
    }
  });

  return report;
};

function shouldBeUsedInLibSource(name, packageJson) {
  return packageJson.hasDep(name)
    || (packageJson.hasPeerDep(name) && ! packageJson.hasDevDep(name));
}

function shouldBeUsedOnlyInDevSource(name, packageJson) {
  return packageJson.hasDevDep(name)
    && ! packageJson.hasPeerDep(name);
}

function isUsedOnlyInDevSource(module) {
  return module.isUsedInDevSource() && ! module.isUsedInLibSource();
}

function mergeOptions(userOptions) {
  return assign({
    dependencies: true,
    devDependencies: true
  }, userOptions);
}
