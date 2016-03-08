import loadPredefinedOptions from './loadPredefinedOptions';
import mergeOptions from './mergeOptions';
import validateOptions from './validateOptions';

/**
 * Load, validate, merge, and normalize options.
 * @param {Object} settings
 * @param {string} settings.cwd - The base directory to search files.
 * @param {Object} settings.options - The additional options.
 * @param {string} settings.configPath - The path of the config file.
 * @param {string} settings.pkgPath - The path of the `package.json`.
 * @param {boolean} settings.noConfigLoading - If true,
 *     Don't load the config file if true.
 * @return {Depcop}
 */
export default function constructOptions({
  cwd,
  options = {},
  configPath,
  pkgPath,
  noConfigLoading = false
}) {
  const finalOptions = noConfigLoading ? options : mergeOptions(
    loadPredefinedOptions(cwd, configPath, pkgPath),
    options
  );

  const result = validateOptions(finalOptions);
  if (result.hasError) {
    throw new Error(result.makeErrorMessage());
  }

  return finalOptions;
}
