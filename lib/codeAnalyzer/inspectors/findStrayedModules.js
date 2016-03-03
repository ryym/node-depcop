
/**
 * Find modules which are listed in wrong group (Curried).
 * The 'strayed module' is a module which is used in a wrong place.
 * There is two patterns of straying:
 *   * A module defined in `dependencies` is used only in development code.
 *   * A module defined in `devDependencies` is used in library code.
 * @name findStrayedModule
 * @param {PackageJson} packageJson
 * @param {Function} makeReporter
 * @param {ImportedModules[]} modules
 * @return {Object}
 */
export default (packageJson, makeReporter) => modules => {
  const report = makeReporter('strayed', 'Modules in wrong group');

  modules.forEach(m => {
    const name = m.getName();

    if (packageJson.hasDep(name) && isUsedOnlyInDevSource(m)) {
      report.onDep(m);
    }
    else if (packageJson.hasDevDep(name) && m.isUsedInLibSource(m)) {
      report.onDevDep(m);
    }
  });

  return report.toObject();
};

function isUsedOnlyInDevSource(module) {
  return module.isUsedInDevSource() && ! module.isUsedInLibSource();
}
