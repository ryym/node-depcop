import Report from './Report';

/**
 * Find unused modules.
 * (Curried)
 * @name findUnlistedModule
 * @param {PackageJson} packageJson
 * @param {ImportedModules[]} modules
 * @return {Object}
 */
export default packageJson => modules => {
  const report = new Report(
    'unused',
    'Unused modules',
    packageJson.getFileInfo()
  );

  const moduleMap = modules.reduce((map, module) => {
    map[module.getName()] = module;
    return map;
  }, {});
  const deps = packageJson.get('dependencies');
  const devDeps = packageJson.get('devDependencies');

  Object.keys(deps).forEach(dep => {
    if (! moduleMap.hasOwnProperty(dep)) {
      report.onPackageJson('dependencies', dep);
    }
  });
  Object.keys(devDeps).forEach(dep => {
    if (! moduleMap.hasOwnProperty(dep)) {
      report.onPackageJson('devDependencies', dep);
    }
  });

  return report.toObject();
};
