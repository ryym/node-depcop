import makeOptionator from 'optionator';
import defineOptions from './defineOptions';
import { makeDepcop } from '../';

/**
 * The core object to parse the CLI options.
 */
const optionator = makeOptionator(defineOptions());

/**
 * Execute the CLI.
 * @param {Array} argv - The `process.argv`.
 * @param {string} pkgJsonPath - The absolute path of `package.json`.
 * @param {Object} log - The logger to output information.
 * @return {Boolean} Whether or not the process has done without any problem
 *     and the dependency checks report no warnings.
 */
module.exports = function execute(argv, pkgJsonPath, log) {
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

  const depcop = makeDepcopFromCLIOptions(values);
  const format = depcop.getFormatter();
  const report = depcop.generateReport();

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
function makeDepcopFromCLIOptions(values) {
  return makeDepcop({
    cwd: process.cwd(),
    configFilePath: values.config,
    noConfigLoading: ! values.depcoprc,
    options: translateOptions(values)
  });
}

/**
 * Translate the CLI options into the options passed to {@link Config}.
 * @private
 */
function translateOptions() {
  return {

    // XXX:
    //  Currently, we can't merge default config
    //  and additional options smartly.

    // libSources: values.libSources,
    // devSources: values.devSources,
    // formatter: values.format,
    // checks: {
    //   missing: values.missing,
    //   strayed: values.strayed,
    //   unused: values.unused
    // }
  };
}
