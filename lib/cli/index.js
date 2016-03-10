import makeOptionator from 'optionator';
import defineOptions from './defineOptions';
import { makeDepcop } from '../';

/**
 * The core object to parse the CLI options.
 */
const optionator = makeOptionator(defineOptions());

/**
 * Execute the CLI.
 * @param {Object} params
 * @param {Object} params.cwd - The base directory path.
 * @param {Array} params.argv - The `process.argv`.
 * @param {string} params.pkgJsonPath - The absolute path of `package.json`.
 * @param {Object} params.log - The logger to output information.
 * @return {Boolean} Whether or not the process has done without any problem
 *     and the dependency checks report no warnings.
 */
module.exports = function executeCLI({ cwd, argv, pkgJsonPath, log }) {
  const values = parseArgv(argv, log);

  if (values === undefined) {
    return false;
  }

  if (values.help) {
    log.info(optionator.generateHelp());
    return true;
  }

  if (values.version) {
    const pkgJson = require(pkgJsonPath);
    log.info(pkgJson.version);
    return true;
  }

  const depcop = makeDepcopFromCLIOptions(cwd, argv, values);
  const format = depcop.getFormatter();
  const report = depcop.runValidations();

  log.info(format(report));

  return report.warningCount === 0;
};

/**
 * Parse the `process.argv`.
 * If any error occurred, return `undefined`.
 * @private
 */
function parseArgv(argv, log) {
  try {
    return optionator.parseArgv(argv);
  }
  catch (ex) {
    log.error(ex.message);
  }
}

/**
 * Create a Depcop instance from the CLI options.
 * @private
 */
function makeDepcopFromCLIOptions(cwd, argv, values) {
  return makeDepcop({
    cwd,
    configFilePath: values.config,
    noConfigLoading: ! values.depcoprc,
    options: translateOptions(argv, values)
  });
}

/**
 * Translate the CLI options into the options passed to {@link Config}.
 * @private
 */
function translateOptions(argv, values) {
  const options = cloneNonemptyValues(values, [
    'libSources', 'devSources', 'format'
  ]);

  options.checks = cloneNonemptyValues(values, [
    'missing', 'unused', 'strayed'
  ]);

  // Accept check options without values.
  // If an option whose type isn't 'Boolean' is specified
  // without a value, optionator completely ignores the option.
  ['missing', 'unused', 'staryed'].forEach(check => {
    if (! values.hasOwnProperty(check) && argv.indexOf(`--${check}`) >= 0) {
      options.checks[check] = {};
    }
  });

  return options;
}

/**
 * Clone the object except undefined properties.
 * @private
 */
function cloneNonemptyValues(values, keys) {
  return keys.reduce((clone, key) => {
    if (values[key] !== undefined) {
      clone[key] = values[key];
    }
    return clone;
  }, {});
}
