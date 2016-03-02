import Config from './Config';
import Depcop from './Depcop';
import PackageJson from './PackageJson';
import loadConfig from './loadConfig';

module.exports = function configure(fromDir) {
  const cwd = fromDir || process.cwd();
  const packageJson = new PackageJson(cwd);

  /**
   * Create a {@link Depcop} instance.
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
 */
function loadDefaultConfig(packageJson, cwd) {
  const config = loadConfig(packageJson, cwd);
  return config ? new Config(config) : Config.default();
}
