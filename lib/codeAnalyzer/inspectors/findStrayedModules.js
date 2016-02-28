import Report from './Report';

/**
 * Find modules which are listed in wrong group.
 * @param {PackageJson} packageJson
 * @param {ImportedModules[]} modules
 * @return {Object}
 */
export default function findStrayedModule(packageJson, modules) {
  const report = new Report('strayed', 'Modules in wrong group');

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
}

function isUsedOnlyInDevSource(module) {
  return module.isUsedInDevSource() && ! module.isUsedInLibSource();
}
