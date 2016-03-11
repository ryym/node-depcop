
/**
 * Load options from the config file.
 * The config file has priority over the config in `package.json`.
 * @param {string} configPath - The path of the config file.
 * @param {string} pkgPath - The path of the `package.json`.
 */
export default function loadPredefinedOptions(configPath, pkgPath) {
  const pkgJson = require(pkgPath);

  if (configPath == null && pkgJson.hasOwnProperty('depcop')) {
    return pkgJson.depcop;
  }

  if (configPath != null) {
    return loadOptionsFromFile(configPath);
  }
}

function loadOptionsFromFile(filePath) {
  return require(filePath);  // XXX: Allow several file types.
}
