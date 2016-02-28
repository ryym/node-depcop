import Report from './Report';

/**
 * Find unlisted modules from imported modules.
 * @param {PackageJson} packageJson
 * @param {ImportedModules[]} modules
 * @return {Object}
 */
export default function findUnlistedModule(packageJson, modules) {
  const report = new Report('unlisted', 'Unlisted modules');

  modules.forEach(m => {
    const name = m.getName();

    if (packageJson.hasDep(name) || packageJson.hasDevDep(name)) {
      return;
    }
    m.isUsedInLibSource() ? report.onDep(m) : report.onDevDep(m);
  });

  return report.toObject();
}
