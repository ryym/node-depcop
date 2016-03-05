import loadSpecifiedConfig from './loadSpecifiedConfig';
import validateConfig from './validateConfig';
import normalizeConfig from './normalizeConfig';

/**
 * Load, validate, and construct a config object.
 * @param {Object} options
 * @return {Object} The normalized config object.
 */
export default function createConfig(options) {
  const configObject = loadConfig(options);
  const result = validateConfig(configObject);

  if (result.hasError) {
    throw new Error(result.makeErrorMessage());
  }

  return normalizeConfig(configObject);
}

/**
 * Load the raw specified configuration.
 * @private
 */
function loadConfig({
  packageJson, cwd, additionalConfig, disableDefaultConfig
}) {
  if (disableDefaultConfig) {
    return additionalConfig;
  }
  const defaultConfig = loadSpecifiedConfig(packageJson, cwd);
  return Object.assign(defaultConfig || {}, additionalConfig);
}
