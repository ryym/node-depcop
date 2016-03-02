import Config from './Config';
import Depcop from './Depcop';
import PackageJson from './PackageJson';
import loadConfig from './loadConfig';

/**
 * Load package.json and create a function
 * that instanciate {@link Depcop}.
 * @param {string} fromDir - The working directory (optional).
 * @return {Function}
 */
module.exports = function configure(fromDir) {
  const cwd = fromDir || process.cwd();
  const packageJson = new PackageJson(cwd);

  /**
   * Load the configuration from config files and
   * create a {@link Depcop} instance.
   * @param {Object} additionalConfig - The config object
   *     merged to the default config.
   * @param {boolean} disableDefaultConfig - If true,
   *     default config is ignored and only additionalConfig is applied.
   * @return {Depcop}
   */
  return function makeDepcop(additionalConfig, disableDefaultConfig) {
    const defaultConfig = loadDefaultConfig(packageJson, cwd);
    const config = disableDefaultConfig
      ? new Config(additionalConfig)
      : defaultConfig.merge(additionalConfig);

    return new Depcop(packageJson, config);
  };
};

/**
 * Load the default configuration.
 * @private
 * @return {Config}
 */
function loadDefaultConfig(packageJson, cwd) {
  const config = loadConfig(packageJson, cwd);
  return config ? new Config(config) : Config.default();
}
