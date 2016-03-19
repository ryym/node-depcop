import findMissingModules from './findMissingModules';
import findStrayedModules from './findStrayedModules';
import findUnusedModules from './findUnusedModules';
import Report from '../Report';

/**
 * The validators.
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
export function loadValidators(packageJson, options) {
  const makeReporter = (name, description) => new Report(name, description);
  const names = Object.keys(options);

  return names.map(name => {
    const validator = validators[name];
    return validator(packageJson, makeReporter, options[name]);
  });
}
