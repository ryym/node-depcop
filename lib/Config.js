import glob from 'glob';
import flatMap from 'lodash.flatmap';
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
  constructor(options) {
    this._options = options;
  }

  /**
   * Get the specified inspector names.
   * @return {Array} inspector names
   */
  getInspectors() {
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
    const { libSources, devSources } = this._options;
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
