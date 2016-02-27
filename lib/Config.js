import glob from 'glob';
import FileInfo from './FileInfo';

/**
 * Config stores and provides configurations.
 */
export default class Config {
  constructor(config) {
    this._config = config;
  }

  getEnabledCheckers() {
    return this._config.checks;
  }

  // TODO: Add devSoruces.
  // TODO: Enable to ignore some files.
  // TODO: Enable to define aliases for some modules.
  listAllTargetFiles() {
    const paths = glob.sync(this._config.libSources, {
      realpath: true
    });
    return paths.map(p => FileInfo.asLib(p));
  }
}
