import loadInspectors from './inspectors';
import ImportedModuleCollector from './ImportedModuleCollector';

const parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
  loc: true
};

function runInspections(inspectors, importedModules) {
  return inspectors.map(inspect => {
    return inspect(importedModules);
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

  const inspectors = loadInspectors(packageJson, config.getInspectors());
  const importedModules = collector.collectImportedModules();
  const reports = runInspections(inspectors, importedModules);

  return reports;
}
