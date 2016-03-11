import { makeIgnorePatternChecker } from './helper';

/**
 * Find missing modules from imported modules (Curried).
 * The 'missing module' is a module which is used in source code
 * but not listed in `dependencies` nor `devDependencies`.
 * @name findMissingModule
 * @param {PackageJson} packageJson
 * @param {Function} makeReporter
 * @param {Object} option
 * @param {ImportedModules[]} modules
 * @return {Object}
 */
export default (packageJson, makeReporter, option) => modules => {
  const report = makeReporter('missing', 'Missing modules');
  const isTarget = makeIgnorePatternChecker(option.ignore);

  modules.forEach(m => {
    const name = m.getName();

    if (packageJson.hasDep(name) || packageJson.hasDevDep(name)) {
      return;
    }

    if (isTarget(name)) {
      const dependents = m.getDependents();
      const adder = m.isUsedInLibSource() ? report.addDep : report.addDevDep;
      adder.call(report, name, dependents);
    }
  });

  return report;
};
