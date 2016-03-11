import assert from 'power-assert';
import FileInfo from '$lib/FileInfo';
import PackageJson from '$lib/PackageJson';
import ImportedModule from '$lib/codeAnalyzer/ImportedModule';

/**
 * Create an instance of {@link PackageJson} that
 * has specified dependencies and devDependencies.
 * @param {string[]} deps - The dependency names.
 * @param {string[]} devDeps - The dev dependency names.
 * @return {PackageJson}
 */
export function makePackageJson({ deps, devDeps }) {
  return new PackageJson('path', {
    dependencies: arrayToObj(deps, ''),
    devDependencies: arrayToObj(devDeps, '')
  });
}

/**
 * Create a tester function for inspectors (Curried).
 * The tester creates test cases for each parameter.
 * @param {PackageJson} packageJson
 * @param {Function} makeInspector
 * @param {Object} options - The options for inspector.
 * @param {Object[]} params
 * @return {Function} A tester function.
 */
export const makeInspectorTester = (
  packageJson, makeInspector
) => (
  options, params
) => {
  const inspect = makeInspector(packageJson, makeReporter, options);

  params.forEach(p => {
    it(`${p.title}`, () => {
      const report = inspect(p.modules);
      assert.deepEqual(report._report, p.report);
    });
  });
};

/**
 * Create an instance of {@link ImportedModule}.
 * @param {string} name - The module name.
 * @param {string[]} fileTypes - 'lib' or 'dev'.
 * @return {ImportedModule}
 */
export function module(name, ...fileTypes) {
  const dependents = fileTypes.map(type => {
    const isLib = type === 'lib';
    return FileInfo[isLib ? 'asLib' : 'asDev']('_');
  });
  return new ImportedModule(name, dependents);
}

/**
 * Convert an array to an object.
 * @private
 * @param {Array} array
 * @param {*} value - The value of all keys.
 */
function arrayToObj(array, value) {
  return array.reduce((o, arrayValue) => {
    o[arrayValue] = value;
    return o;
  }, {});
}

/**
 * Create reporter used by inspectors
 * to report errors.
 * @private
 * @return {Object}
 */
function makeReporter() {
  const report = { dep: [], devDep: [] };
  return {
    addDep(moduleName) {
      report.dep.push(moduleName);
    },

    addDevDep(moduleName) {
      report.devDep.push(moduleName);
    },

    _report: report
  };
}
