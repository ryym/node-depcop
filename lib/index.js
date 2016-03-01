import Config from './Config';
import Depcop from './Depcop';
import PackageJson from './PackageJson';

module.exports = function configure(fromDir) {
  const cwd = fromDir || process.cwd();
  const packageJson = new PackageJson(cwd);

  /**
   * Create a {@link Depcop} instance.
   */
  return function makeDepcop(additionalConfig, disableDefaultConfig) {
    const defaultConfig = Config.default();
    const config = disableDefaultConfig
      ? new Config(additionalConfig)
      : defaultConfig.merge(additionalConfig);

    return new Depcop(packageJson, config);
  };
};
