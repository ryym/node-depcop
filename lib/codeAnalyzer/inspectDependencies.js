import loadInspectors from './loadInspectors';
import ImportedModuleCollector from './ImportedModuleCollector';

const parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
  loc: true
};

/**
 * Verify dependencies by searching source code.
 * @param {PackageJson} packageJson
 * @param {Config} config
 * @param {Function} readFile - Used to read source files.
 * @return {Object[]} The results of the inspections.
 */
export default function inspectDependencies(
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

  // Run inspections and generate reports.
  const reports = inspectors.map(inspect => inspect(importedModules));

  return reports;
}
