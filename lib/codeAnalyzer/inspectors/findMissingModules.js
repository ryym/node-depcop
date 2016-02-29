import Report from './Report';

/**
 * Find missing modules from imported modules.
 * @param {PackageJson} packageJson
 * @param {ImportedModules[]} modules
 * @return {Object}
 */
export default function findMissingModule(packageJson, modules) {
  const report = new Report('missing', 'Missing modules');

  modules.forEach(m => {
    const name = m.getName();

    if (packageJson.hasDep(name) || packageJson.hasDevDep(name)) {
      return;
    }
    m.isUsedInLibSource() ? report.onDep(m) : report.onDevDep(m);
  });

  return report.toObject();
}
