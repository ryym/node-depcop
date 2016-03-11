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

  const importedModules = collector.collectImportedModules();
  const inspectors = loadInspectors(packageJson, config.getInspectors());
  const result = runInspections(inspectors, importedModules);

  return result;
}

/**
 * Run inspections for the given modules.
 * @private
 */
function runInspections(inspectors, importedModules) {
  const reports = inspectors.map(inspect => {
    const report = inspect(importedModules);
    return report.getReport();
  }
  );
  return organizeReports(reports);
}

/**
 * Organize reports.
 * @private
 */
function organizeReports(reports) {
  const warningCount = reports.reduce((count, report) => {
    const { dependencies, devDependencies } = report.modules;
    return count + dependencies.length + devDependencies.length;
  }, 0);

  return {
    warningCount,
    reports
  };
}
