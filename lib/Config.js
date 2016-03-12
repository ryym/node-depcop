import FileInfo from './FileInfo';

/**
 * Config stores a given configuration object and
 * provides accessor methods to it.
 */
export default class Config {

  /**
   * Initialize Config with the specified options.
   * @param {Object} options
   */
  constructor(options, paths) {
    this._options = options;
    this._paths = paths;
  }

  /**
   * Get the specified validator names.
   * @return {Array} validator names
   */
  getValidators() {
    return this._options.checks;
  }

  /**
   * Get the specified format.
   * @return {string} The format name.
   */
  getFormat() {
    return this._options.format;
  }

  /**
   * Return an array of all target source files.
   * @return {Array}
   */
  listAllTargetFiles() {
    const { libSources, devSources } = this._paths;
    return [].concat(
      libSources.map(p => FileInfo.asLib(p)),
      devSources.map(p => FileInfo.asDev(p))
    );
  }
}
