import assert from 'power-assert';
import path from 'path';
import spawn from 'cross-spawn';

const ROOT_DIR = path.resolve(__dirname, '../../');
const BIN_COMMAND = path.join('bin', 'depcop');

function runCommand() {
  return spawn(BIN_COMMAND, [
    '--no-depcoprc', '-f', 'json'
  ], { cwd: ROOT_DIR });
}

/**
 * A mini test to verify bin file works fine.
 */
describe('bin/depcop', function() {
  this.timeout(5000);

  it('outputs a report', done => {
    const process = runCommand();

    process.stdout.on('data', data => {
      const result = JSON.parse(String(data));
      assert.deepEqual(
        result,
        { warningCount: 0, reports: [] }
      );
    });

    process.stderr.on('data', data => {
      throw new Error(String(data));
    });

    process.on('close', done);
  });
});
