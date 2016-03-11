import makeOptionator from 'optionator';
import { makeDepcop } from '../';
import {
  defineOptions,
  defaultsWhenSpecified
} from './defineOptions';

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
  const args = normalizeArgv(argv);
  const values = parseArgs(args, log);

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
 * Normalize the `process.argv` and return a new array.
 * The array doesn't contain path information the argv has.
 * @private
 */
function normalizeArgv(rawArgv) {
  const argv = rawArgv.slice(2);
  const length = argv.length;
  const args = [];

  argv.forEach((arg, idx) => {
    const needDefault = defaultsWhenSpecified.has(arg)
      && (idx === length - 1 || argv[idx + 1].startsWith('-'));

    if (needDefault) {
      args.push(arg, defaultsWhenSpecified.get(arg));
    }
    else {
      args.push(arg);
    }
  });

  return args;
}

/**
 * Parse the normalized arguments.
 * If any error occurred, return `undefined`.
 * @private
 */
function parseArgs(args, log) {
  try {
    return optionator.parse(args, { slice: 0 });
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
