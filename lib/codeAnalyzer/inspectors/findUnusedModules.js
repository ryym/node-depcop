import { makeIgnorePatternChecker } from './helper';

/**
 * Find unused modules (Curried).
 * The 'unused module' is a module which is listed in
 * `dependencies` or `devDependencies` but used in nowhere.
 * @name findUnlistedModule
 * @param {PackageJson} packageJson
 * @param {Function} makeReporter
 * @param {Object} option
 * @param {ImportedModules[]} modules
 * @return {Object}
 */
export default (packageJson, makeReporter, option) => modules => {
  const report = makeReporter('unused', 'Unused modules');

  const moduleMap = modules.reduce((map, module) => {
    map[module.getName()] = module;
    return map;
  }, {});
  const deps = packageJson.get('dependencies');
  const devDeps = packageJson.get('devDependencies');
  const pkgFile = packageJson.getFileInfo();
  const isTarget = makeIgnorePatternChecker(option.ignore);

  Object.keys(deps).forEach(dep => {
    if (isTarget(dep) && ! moduleMap.hasOwnProperty(dep)) {
      report.addDep(dep, [pkgFile]);
    }
  });
  Object.keys(devDeps).forEach(dep => {
    if (isTarget(dep) && ! moduleMap.hasOwnProperty(dep)) {
      report.addDevDep(dep, [pkgFile]);
    }
  });

  return report.toObject();
};
