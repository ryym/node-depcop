import assert from 'power-assert';
import chalk from 'chalk';
import FileInfo from '$lib/FileInfo';
import Report from '$lib/Report';

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
