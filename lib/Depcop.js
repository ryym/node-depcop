import fs from 'fs';
import inspectDependencies from './codeAnalyzer/inspectDependencies';

/**
 * Depcop verifies source code and generates a report.
 */
export default class Depcop {
  constructor(packageJson, config) {
    this._packageJson = packageJson;
    this._config = config;
  }

  generateReport() {
    const readFile = path => fs.readFileSync(path, 'utf8');
    return inspectDependencies(
      this._packageJson, this._config, readFile
    );
  }

  getFormatter(formatterName) {
    return this._config.getFormatter(formatterName);
  }
}
