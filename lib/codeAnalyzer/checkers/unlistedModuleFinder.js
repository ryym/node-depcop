/**
 * Find modules which are unlisted in dependencies of package.json.
 * @name unlistedModulesFinder
 */
export default context => {
  const report = context.makeReporter('unlisted', 'Unlisted modules');
  const packageJson = context.getPackageJson();
  const deps = packageJson.dependencies || {};
  const devDeps = packageJson.devDependencies || {};

  return {
    checkImport(node, fileInfo) {
      const moduleName = node.source.value;

      if (/^\.\.?\//.test(moduleName)) {
        return;
      }

      if (deps.hasOwnProperty(moduleName)
        || devDeps.hasOwnProperty(moduleName)) {
        return;
      }

      report(fileInfo, moduleName, node.source.loc);
    }
  };
};

