import findup from 'findup-sync';

const CONFIG_FILE_NAME = '.depcoprc.js';

/**
 * Load a configuration from the package.json or config file.
 * @param {PackageJson} packageJson
 * @param {string} cwd - (Optional)
 * @return {string} The first matching file.
 */
export default function loadSpecifiedConfig(packageJson, cwd) {
  const confInPkg = packageJson.get('depcop', null);
  if (confInPkg !== null) {
    return confInPkg;
  }

  cwd = cwd || process.cwd();
  const configFilePath = findup(CONFIG_FILE_NAME, { cwd });
  if (configFilePath) {
    return require(configFilePath);
  }
}
