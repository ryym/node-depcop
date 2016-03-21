import { loadValidators } from './validators';
import { collectModulesFromSource } from './codeAnalyzer';

/**
 * Verify dependencies by collecting used modules.
 * @param {PackageJson} packageJson
 * @param {Config} config
 * @param {Function} readFile - Used to read source files.
 * @return {Object[]} The results of the validations.
 */
export default function verify(packageJson, config, readFile) {
  const validators = loadValidators(packageJson, config.getValidators());
  const importedModules = collectModulesFromSource({
    parserOptions: config.getParserOptions(),
    targetFiles: config.listAllTargetFiles(),
    readFile
  });
  const reports = runValidations(validators, importedModules);
  return organizeReports(reports);
}

/**
 * Run validations for the given modules.
 * @private
 */
function runValidations(validators, importedModules) {
  return validators.map(validate => {
    const report = validate(importedModules);
    return report.getReport();
  });
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
