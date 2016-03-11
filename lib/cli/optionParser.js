import makeOptionator from 'optionator';
import {
  defineOptions,
  defaultsWhenSpecified
} from './optionDefinitions';

/**
 * @typedef {Object} ParseArgvReturn
 * @property {Object} cliOptions The values parsed by optionator.
 * @property {Object} depcopOptions The options which can be passed to core API.
 * @property {Error} error The error thrown during parsing.
 */

/**
 * The core object to parse the CLI options.
 * @private
 */
const optionator = makeOptionator(defineOptions());

/**
 * Generate a help message based on the option definitions.
 */
export const generateHelp = optionator.generateHelp.bind(optionator);

/**
 * Parses the `process.argv` into options expected by core API.
 * @param {string[]} argv - The CLI arguments.
 * @return {ParseArgvReturn}
 */
export function parseArgv(argv) {
  const args = normalizeArgv(argv);
  let cliOptions;

  try {
    cliOptions = optionator.parse(args, { slice: 0 });
  }
  catch (error) {
    return { error };
  }

  const depcopOptions = translateOptions(cliOptions);
  return { cliOptions, depcopOptions };
}

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
 * Translate the CLI options into the options passed to {@link Config}.
 * @private
 */
function translateOptions(values) {
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
