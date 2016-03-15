import findup from 'findup-sync';
import glob from 'glob';
import assign from 'lodash.assign';
import flatMap from 'lodash.flatmap';
import PackageJson from './PackageJson';
import Config from './Config';
import Depcop from './Depcop';
import {
  constructOptions,
  CONFIG_FILE_NAME
} from './options';

/**
 * Create a {@link Depcop} instance which verifies dependency definitions.
 * @param {Object} rawSettings - The settings for {@link constructOptions}.
 * @return {Depcop}
 */
export default function makeDepcop(rawSettings) {
  const settings = normalizeSettings(rawSettings);
  const options = constructOptions(settings);
  const { pkgPath } = settings;

  const packageJson = new PackageJson(pkgPath, require(pkgPath));
  const config = makeConfig(options);

  return new Depcop(packageJson, config);
}

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

  return assign(
    {}, settings, { cwd, pkgPath, configPath }
  );
}

/**
 * Create a {@link Config} instance based on the
 * specified options.
 * @private
 */
function makeConfig(options) {
  const { libSources, devSources } = options;
  return new Config(options, {
    libSources: resolveFilePatterns(libSources),
    devSources: resolveFilePatterns(devSources)
  });
}

/**
 * Find files matched given patterns and return their paths.
 * @private
 */
function resolveFilePatterns(patterns = []) {
  return flatMap(patterns, pattern => {
    return glob.sync(pattern, { realpath: true });
  });
}
