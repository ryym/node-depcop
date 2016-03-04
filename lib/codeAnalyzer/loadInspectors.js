import findMissingModules from './inspectors/findMissingModules';
import findStrayedModules from './inspectors/findStrayedModules';
import findUnusedModules from './inspectors/findUnusedModules';
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

  return names.map(name => {
    const inspector = inspectors[name];
    return inspector(packageJson, makeReporter, options[name]);
  });
}
