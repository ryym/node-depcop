import fs from 'fs';
import inspectDependencies from './codeAnalyzer/inspectDependencies';

/**
 * Depcop generates a report about dependencies by searching
 * sources to verify all dependency definitions in package.json
 * are collect.
 */
export default class Depcop {

  /**
   * Initialize Depcop
   * @param {PackageJson} packageJson
   * @param {Config} config
   */
  constructor(packageJson, config) {
    this._packageJson = packageJson;
    this._config = config;
  }

  /**
   * Check all sources and generate a report about
   * used or unused dependencies.
   * @return {Object}
   */
  generateReport() {
    const readFile = path => fs.readFileSync(path, 'utf8');
    return inspectDependencies(
      this._packageJson, this._config, readFile
    );
  }

  /**
   * Get the specified formatter to format the report.
   * @param {string} formatterName
   * @return {Function}
   */
  getFormatter(formatterName) {
    return this._config.getFormatter(formatterName);
  }
}
