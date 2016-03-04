import findMissingModules from './findMissingModules';
import findStrayedModules from './findStrayedModules';
import findUnusedModules from './findUnusedModules';
import Report from './Report';

/**
 * Inspectors.
 * @private
 */
const inspectors = {
  missing: findMissingModules,
  strayed: findStrayedModules,
  unused: findUnusedModules
};

/**
 * Configure and load the specified inspector functions.
 * @param {PackageJson} packageJson
 * @param {Object} options - The options for inspectors.
 * @return {Function[]} The inspectors.
 */
export default function loadInspectors(packageJson, options) {
  const makeReporter = (name, description) => new Report(name, description);
  const names = Object.keys(options);

  return names.map(
    name => inspectors[name](packageJson, makeReporter, options[name])
  );
}
