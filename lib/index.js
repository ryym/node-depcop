import Config from './Config';
import Depcop from './Depcop';
import PackageJson from './PackageJson';

module.exports = function configure(fromDir) {
  const cwd = fromDir || process.cwd();
  const packageJson = new PackageJson(cwd);

  /**
   * Create a {@link Depcop} instance.
   */
  // TODO: Enable to use default config.
  return function makeDepcop(additionalConfig) {
    const config = new Config(additionalConfig);
    return new Depcop(packageJson, config);
  };
};
