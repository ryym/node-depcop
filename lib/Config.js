import glob from 'glob';
import FileInfo from './FileInfo';
import getFormatter from './formatters';

/**
 * Config stores and provides configurations.
 */
export default class Config {
  constructor(config) {
    this._config = config;
  }

  getEnabledInspectors() {
    return this._config.checks;
  }

  getFormatter(formatterName) {
    formatterName = formatterName || this._config.formatter;
    return getFormatter(formatterName);
  }

  // TODO: Enable to ignore some files.
  // TODO: Enable to define aliases for some modules.
  listAllTargetFiles() {
    const { libSources, devSources } = this._config;
    const libSourcePaths = this._glob(libSources);
    const devSourcePaths = this._glob(devSources);

    return [].concat(
      libSourcePaths.map(p => FileInfo.asLib(p)),
      devSourcePaths.map(p => FileInfo.asDev(p))
    );
  }

  merge(other) {
    const config = Object.assign(
      {}, this._config, other
    );
    return new Config(config);
  }

  _glob(paths) {
    return glob.sync(paths, { realpath: true });
  }
}

/**
 * Default config.
 */
Config.default = function() {
  return new Config({
    checks: [
      'missing',
      'strayed',
      'unused'
    ],
    formatter: 'json'
  });
};
