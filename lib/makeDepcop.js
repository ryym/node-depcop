import findup from 'findup-sync';
import PackageJson from './PackageJson';
import Config from './Config';
import Depcop from './Depcop';
import {
  constructOptions,
  CONFIG_FILE_NAME
} from './options';

/**
 * Create a {@link Depcop} instance which verifies dependency definitions.
 * @param {Object} settings - The settings for {@link constructOptions}.
 * @return {Depcop}
 */
module.exports = function makeDepcop(rawSettings) {
  const settings = normalizeSettings(rawSettings);
  const options = constructOptions(settings);
  const { pkgPath } = settings;

  const packageJson = new PackageJson(pkgPath, require(pkgPath));
  const config = new Config(options);

  return new Depcop(packageJson, config);
};

/**
 * Normalize settings. Some properties are filled with
 * default values if it isn't set.
 * @private
 */
function normalizeSettings(settings = {}) {
  let { cwd, pkgPath, configPath } = settings;

  cwd = cwd || process.cwd();
  pkgPath = pkgPath || findup('package.json', { cwd });
  configPath = configPath || findup(CONFIG_FILE_NAME, { cwd });

  return Object.assign(
    {}, settings, { cwd, pkgPath, configPath }
  );
}
