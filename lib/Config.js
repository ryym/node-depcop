import glob from 'glob';
import flatMap from 'lodash.flatmap';
import FileInfo from './FileInfo';
import getFormatter from './formatters';

/**
 * Config stores a given configuration object and
 * provides accessor methods to it.
 */
export default class Config {

  /**
   * Initialize Config.
   * @param {Object} config
   */
  constructor(config) {
    this._config = config;
  }

  /**
   * Get the specified inspector names.
   * @return {Array} inspector names
   */
  getInspectors() {
    return this._config.checks;
  }

  /**
   * Get the formatter from its name. If the name is omitted,
   * returns the formatter specified in the config.
   * @param {string} formatterName
   * @return {Function} The formatter function.
   */
  getFormatter(formatterName) {
    formatterName = formatterName || this._config.formatter;
    return getFormatter(formatterName);
  }

  /**
   * Return an array of all target source files.
   * @return {Array}
   */
  listAllTargetFiles() {
    const { libSources, devSources } = this._config;
    const libSourcePaths = this._glob(libSources);
    const devSourcePaths = this._glob(devSources);

    return [].concat(
      libSourcePaths.map(p => FileInfo.asLib(p)),
      devSourcePaths.map(p => FileInfo.asDev(p))
    );
  }

  /**
   * Find files matched with given patterns.
   * @private
   * @param {Array} patterns
   * @return {Array} The mathced paths.
   */
  _glob(patterns = []) {
    return flatMap(patterns, pattern => {
      return glob.sync(pattern, { realpath: true });
    });
  }
}
