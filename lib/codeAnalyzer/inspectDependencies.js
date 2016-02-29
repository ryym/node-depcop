import loadInspector from './inspectors';
import ImportedModuleCollector from './ImportedModuleCollector';

const parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
  loc: true
};

function loadInspectors(inspectors) {
  const names = Object.keys(inspectors);
  return names.map(name => loadInspector(name));
}

function runInspections(inspectors, packageJson, importedModules) {
  return inspectors.map(inspect => {
    return inspect(packageJson, importedModules);
  });
}

/**
 * Verify dependencies by searching source code.
 */
export default function checkDependencies(
  packageJson, config, readFile
) {
  const collector = new ImportedModuleCollector(parserOptions);
  const fileInfos = config.listAllTargetFiles();

  fileInfos.forEach(fileInfo => {
    const content = readFile(fileInfo.getPath());
    collector.searchImports(content, fileInfo);
  });

  const inspectors = loadInspectors(config.getInspectors());
  const importedModules = collector.collectImportedModules();
  const reports = runInspections(inspectors, packageJson, importedModules);

  return reports;
}
