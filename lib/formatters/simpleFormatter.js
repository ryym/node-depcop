import chalk from 'chalk';

const INDENT_LENGTH = 2;

/**
 * Format results to a string to be printed.
 * @param {Object} result
 * @return {string} The string of formatted results.
 */
export default function formatResults(result) {
  const { reports, warningCount } = result;

  if (warningCount === 0) {
    return '';
  }

  const formattedString = reports
    .map(report => formatReport(report, 0))
    .join('');
  const problems = makeProblemCount(warningCount);

  return `\n${formattedString}${problems}\n`;
}

/**
 * Make problem count summary.
 * @private
 */
function makeProblemCount(count) {
  const problems = count === 1 ? 'problem' : 'problems';
  return chalk.bold.red(`\u2716 ${count} ${problems}`);
}

/**
 * Format a report.
 * @private
 */
function formatReport(report, nIndent) {
  const dependenciesResult = formatDependencies(
    report.modules,
    incIndent(nIndent)
  );

  const { dependencies, devDependencies } = report.modules;
  const warningCount = dependencies.length + devDependencies.length;

  if (dependenciesResult !== '') {
    const title = chalk.bold(report.description);
    return `${title} (${warningCount})\n\n${dependenciesResult}`;
  }
  return '';
}

/**
 * Format a dependencies and dev-dependencies.
 * @private
 */
function formatDependencies(modules, nIndent) {
  const indent = makeIndent(nIndent);

  return ['dependencies', 'devDependencies']
    .map(groupName => {
      const group = modules[groupName];
      if (group.length === 0) {
        return '';
      }

      const locations = formatModules(group, incIndent(nIndent));
      const linedName = chalk.underline(groupName);
      return `${indent}${linedName}\n${locations}\n`;
    })
    .join('');
}

/**
 * Format a module array.
 * @private
 */
function formatModules(modules, nIndent) {
  const indent = makeIndent(nIndent);

  return modules
    .map(module => {
      const name = chalk.red(module.moduleName);
      const files = formatFiles(module.at, incIndent(nIndent));
      return `${indent}${name}\n${files}`;
    })
    .join('\n') + '\n';
}

/**
 * Format a location data array.
 * @private
 */
function formatFiles(files, nIndent) {
  const indent = makeIndent(nIndent);

  return files
    .map(file => {
      return `${indent}${file.path}`;
    })
    .join('\n');
}

function incIndent(nIndent) {
  return nIndent + INDENT_LENGTH;
}

function makeIndent(number) {
  return ' '.repeat(number);
}
