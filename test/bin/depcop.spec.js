import assert from 'power-assert';
import path from 'path';
import spawn from 'cross-spawn';

const ROOT_DIR = path.resolve(__dirname, '../../');
const BIN_COMMAND = path.join('bin', 'depcop');

function runCommand() {
  return spawn(BIN_COMMAND, [
    '"lib/**/*.js"', '"test/**/*.spec.js"'
  ], {
    cwd: ROOT_DIR
  });
}

/**
 * A mini test to verify bin file works fine.
 */
describe('bin/depcop', function() {
  this.timeout(5000);

  it.skip('outputs a report', done => {
    const process = runCommand();

    process.stdout.on('data', data => {
      const reports = JSON.parse(String(data)).reports;
      assert(Array.isArray(reports));

      const report = reports[0];
      assert.deepEqual(
        ['name', 'description', 'modules'].map(p => report.hasOwnProperty(p)),
        [true, true, true]
      );
    });

    process.stderr.on('data', data => {
      throw new Error(String(data));
    });

    process.on('close', done);
  });
});
