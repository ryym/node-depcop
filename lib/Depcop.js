import fs from 'fs';
import verify from './verify';
import getFormatter from './formatters';

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
   * Run the specified validations and generate a report.
   * @return {Object}
   */
  runValidations() {
    const readFile = path => fs.readFileSync(path, 'utf8');
    return verify(this._packageJson, this._config, readFile);
  }

  /**
   * Get the formatter from its name. If the name is omitted,
   * returns the formatter specified in the options.
   * @param {string} format
   * @return {Function} The formatter function.
   */
  getFormatter(format) {
    return getFormatter(format || this._config.getFormat() || 'default');
  }
}
