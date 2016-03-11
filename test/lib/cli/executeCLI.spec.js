import assert from 'power-assert';
import forEach from 'mocha-each';
import sinon from 'sinon';
import executeCLI from '$lib/cli/executeCLI';
import { fixturePath } from '../helper';

const WRK_DIR = fixturePath('cli');
const PKG_PATH = fixturePath('cli', 'package.json');

/** @test {executeCLI} */
describe('executeCLI()', () => {
  const pkgJson = require(PKG_PATH);
  const log = {};

  function exec(...args) {
    const argv = ['node', 'file'].concat(args);
    return executeCLI({
      log,
      argv,
      cwd: WRK_DIR,
      pkgJsonPath: PKG_PATH
    });
  }

  beforeEach(() => {
    log.info = sinon.spy();
    log.error = sinon.spy();
  });

  context('with invalid CLI options', () => {
    let result;

    // eslint-disable-next-line no-return-assign
    beforeEach(() => result = false);
    afterEach(() => assert(! result));

    it('logs an error and returns false', () => {
      result = exec('--invalid', '-opt');
      assert.equal(log.error.callCount, 1);
    });
  });

  context('with valid CLI options', () => {
    let result;

    // eslint-disable-next-line no-return-assign
    beforeEach(() => result = true);
    afterEach(() => assert(result));

    forEach([
      [[]],
      ['--config', 'somewhere'],
      ['--no-depcoprc', '-f', 'json'],
      ['--missing', 'ignore:foo.js'],
      ['-l', 'a', '-l', 'b']
    ])
    .it('outputs a result: %j', args => {
      result = exec(...args);
      assert.equal(log.info.callCount, 1);
    });

    context('--help', () => {
      it('outputs a help message', () => {
        result = exec('--help');

        const message = log.info.args[0][0];
        assert(/^Usage:/.test(message));
      });
    });

    context('--version', () => {
      it('outputs a version number', () => {
        result = exec('--version');

        const version = log.info.args[0][0];
        assert.equal(version, pkgJson.version);
      });
    });

  });

});
