import { makeDepcop } from '../';
import {
  generateHelp,
  parseArgv
} from './optionParser';

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
export default function executeCLI({ cwd, argv, pkgJsonPath, log }) {
  const { cliOptions, depcopOptions, error } = parseArgv(argv);

  if (error !== undefined) {
    log.error(error.message);
    return false;
  }

  if (cliOptions.help) {
    log.info(generateHelp());
    return true;
  }

  if (cliOptions.version) {
    const pkgJson = require(pkgJsonPath);
    log.info(pkgJson.version);
    return true;
  }

  const depcop = makeDepcopFromCLIOptions(cwd, cliOptions, depcopOptions);
  const format = depcop.getFormatter();
  const report = depcop.runValidations();

  log.info(format(report));

  return report.warningCount === 0;
}

/**
 * Create a Depcop instance from the CLI options.
 * @private
 */
function makeDepcopFromCLIOptions(cwd, cliOptions, depcopOptions) {
  return makeDepcop({
    cwd,
    options: depcopOptions,
    configFilePath: cliOptions.config,
    noConfigLoading: ! cliOptions.depcoprc
  });
}
