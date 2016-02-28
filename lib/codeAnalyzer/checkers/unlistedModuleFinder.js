/**
 * Find modules which are unlisted in dependencies of package.json.
 * @name unlistedModulesFinder
 */
export default context => {
  const report = context.makeReporter('unlisted', 'Unlisted modules');
  const packageJson = context.getPackageJson();

  return {
    checkImport(node, fileInfo) {
      const moduleName = node.source.value;

      if (/^\.\.?\//.test(moduleName)) {
        return;
      }

      if (packageJson.hasDep(moduleName)
        || packageJson.hasDevDep(moduleName)) {
        return;
      }

      report(fileInfo, moduleName, node.source.loc);
    }
  };
};

