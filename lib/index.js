import findup from 'findup-sync';
import constructConfig from './config/constructConfig';
import Config from './Config';
import Depcop from './Depcop';
import PackageJson from './PackageJson';

/**
 * Load package.json and create a function
 * that instanciate {@link Depcop}.
 * @param {string} fromDir - The working directory (optional).
 * @return {Function}
 */
module.exports = function configure(fromDir) {
  const cwd = fromDir || process.cwd();
  const packageJson = loadPackageJson(cwd);

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
    const configObject = constructConfig({
      packageJson, cwd, additionalConfig, disableDefaultConfig
    });
    const config = new Config(configObject);
    return new Depcop(packageJson, config);
  };
};

/**
 * Load package.json.
 * @private
 * @return {PackageJson}
 */
function loadPackageJson(cwd) {
  const pkgPath = findup('package.json', { cwd });
  const json = require(pkgPath);
  return new PackageJson(pkgPath, json);
}
