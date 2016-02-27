import Config from './Config';
import Depcop from './Depcop';
import findup from 'findup-sync';

module.exports = function configure(fromDir) {
  const cwd = fromDir || process.cwd();
  const pkgPath = findup('package.json', { cwd });
  const packageJson = require(pkgPath);

  /**
   * Create a {@link Depcop} instance.
   */
  // TODO: Enable to use default config.
  return function makeDepcop(additionalConfig) {
    const config = new Config(additionalConfig);
    return new Depcop(packageJson, config);
  };
};
