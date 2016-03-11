import assert from 'power-assert';
import chalk from 'chalk';
import FileInfo from '$lib/FileInfo';
import Report from '$lib/codeAnalyzer/Report';

/**
 * A tagged template string processor to strip
 * unnecessary indents.
 */
export function unindent(strings, ...values) {
  const lines = String.raw(strings, values).split('\n');

  const minIndents = lines
    .filter(line => /\S/.test(line))
    .reduce((min, line) => {
      const nIndents = line.match(/^\s+/)[0].length;
      return Math.min(min, nIndents);
    }, Infinity);

  return lines
    .map(line => line.substring(minIndents))
    .join('\n');
}

/**
 * Create a report using {@link Report} class.
 * @param {string} description
 * @param {Object} modules
 * @param {string[]} modules.dep - The dependency module names.
 * @param {string[]} modules.devDep - The dev-dependency module names.
 * @return {Object}
 */
export function report(description, { dep, devDep }) {
  const report = new Report(description, description);

  dep.forEach(name => {
    const file = FileInfo.asLib(`lib/path/to/${name}`);
    report.addDep(name, [file]);
  });
  devDep.forEach(name => {
    const file = FileInfo.asLib(`dev/path/to/${name}`);
    report.addDevDep(name, [file]);
  });

  return report.getReport();
}

/**
 * Define test cases for each input and output.
 * @param {string} commonTitle
 * @param {Function} formatter
 * @param {Object} data
 * @return {void}
 */
export function testFormatter(commonTitle, formatter, data) {
  data.forEach(({ title, output, input }) => {
    it(`${commonTitle} (${title})`, () => {
      const actualOutput = formatter(input);
      assert.equal(chalk.stripColor(actualOutput), output);
    });
  });
}
