import findMissingModules from './validators/findMissingModules';
import findStrayedModules from './validators/findStrayedModules';
import findUnusedModules from './validators/findUnusedModules';
import Report from './Report';

/**
 * validators.
 * @private
 */
const validators = {
  missing: findMissingModules,
  strayed: findStrayedModules,
  unused: findUnusedModules
};

/**
 * Configure and load the specified validator functions.
 * @param {PackageJson} packageJson
 * @param {Object} options - The options for validators.
 * @return {Function[]} The validators.
 */
export default function loadValidators(packageJson, options) {
  const makeReporter = (name, description) => new Report(name, description);
  const names = Object.keys(options);

  return names.map(name => {
    const validator = validators[name];
    return validator(packageJson, makeReporter, options[name]);
  });
}
