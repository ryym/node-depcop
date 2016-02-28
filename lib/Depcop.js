import fs from 'fs';
import inspectDependencies from './codeAnalyzer/inspectDependencies';

/**
 * Depcop verifies source code and generates a report.
 */
export default class Depcop {
  constructor(packageJson, configs) {
    this._packageJson = packageJson;
    this._configs = configs;
  }

  generateReport() {
    const readFile = path => fs.readFileSync(path, 'utf8');
    return inspectDependencies(
      this._packageJson, this._configs, readFile
    );
  }

  // TODO: Define function to get a formatter.
}
