import loadValidators from './loadValidators';
import ImportedModuleCollector from './ImportedModuleCollector';

const DEFAULT_PARSER_OPTIONS = {
  ecmaVersion: 6,
  sourceType: 'module',
  loc: true
};

/**
 * Verify dependencies by searching source code.
 * @param {PackageJson} packageJson
 * @param {Config} config
 * @param {Function} readFile - Used to read source files.
 * @return {Object[]} The results of the validations.
 */
export default function verifyDependencies(
  packageJson, config, readFile
) {
  const parserOptions = getParserOptions(config);
  const collector = new ImportedModuleCollector(parserOptions);
  const fileInfos = config.listAllTargetFiles();

  fileInfos.forEach(fileInfo => {
    const content = readFile(fileInfo.getPath());
    collector.searchImports(content, fileInfo);
  });

  const importedModules = collector.collectImportedModules();
  const validators = loadValidators(packageJson, config.getValidators());
  const result = runValidations(validators, importedModules);

  return result;
}

function getParserOptions(config) {
  return Object.assign(
    {}, DEFAULT_PARSER_OPTIONS, config.getParserOptions()
  );
}

/**
 * Run validations for the given modules.
 * @private
 */
function runValidations(validators, importedModules) {
  const reports = validators.map(validate => {
    const report = validate(importedModules);
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
