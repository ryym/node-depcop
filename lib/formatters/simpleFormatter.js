import chalk from 'chalk';

const INDENT_LENGTH = 2;

/**
 * Format results to a string to be printed.
 * @param {Object} result
 * @return {string} The string of formatted results.
 */
export default function formatResults(result) {
  if (result.warningCount === 0) {
    return '';
  }

  const formattedString = result.reports
    .map(report => formatReport(report, 0))
    .join('');
  return `\n${formattedString}`;
}

/**
 * Format a report.
 * @private
 */
function formatReport(report, nIndent) {
  const dependencies = formatDependencies(
    report.modules,
    incIndent(nIndent)
  );

  if (dependencies !== '') {
    const title = chalk.bold(report.description);
    return `${title}\n\n${dependencies}`;
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
