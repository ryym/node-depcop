import Report from './Report';

/**
 * Find missing modules from imported modules.
 * (Curried)
 * @name findMissingModule
 * @param {PackageJson} packageJson
 * @param {Object} option
 * @param {ImportedModules[]} modules
 * @return {Object}
 */
export default (packageJson, option) => modules => {
  const report = new Report('missing', 'Missing modules');
  const isTarget = makeIsTarget(option);

  modules.forEach(m => {
    const name = m.getName();

    if (packageJson.hasDep(name) || packageJson.hasDevDep(name)) {
      return;
    }

    if (isTarget(name)) {
      m.isUsedInLibSource() ? report.onDep(m) : report.onDevDep(m);
    }
  });

  return report.toObject();
};

function makeIsTarget(option) {
  if (! Array.isArray(option.ignore)) {
    return () => true;
  }
  const patterns = option.ignore.map(p => new RegExp(p));

  return moduleName => patterns
      .filter(p => p.test(moduleName))
      .length === 0;
}
