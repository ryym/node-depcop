import assert from 'power-assert';
import path from 'path';
import loadConfig from '$lib/loadConfig';
import PackageJson from '$lib/PackageJson';
import { FIXTURES_PATH } from './helper';
import fixtureConfig from './fixtures/loadConfig/.depcoprc';

const MY_FIXTURES_PATH = path.join(FIXTURES_PATH, 'loadConfig');

/** @test {loadConfig} */
describe('loadConfig()', () => {
  it('loads configurations from the config file', () => {
    const packageJson = new PackageJson('foo/bar', {});
    const config = loadConfig(packageJson, MY_FIXTURES_PATH);

    assert.deepEqual(config, fixtureConfig);
  });

  context('when package.json has configs', () => {
    it('loads configurations from package.json', () => {
      const packageJson = new PackageJson('foo/bar', {
        'depcop': { isPackageJson: true }
      });
      const config = loadConfig(packageJson, MY_FIXTURES_PATH);

      assert(config.isPackageJson);
    });
  });
});

