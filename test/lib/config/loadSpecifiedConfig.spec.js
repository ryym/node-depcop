import assert from 'power-assert';
import path from 'path';
import loadSpecifiedConfig from '$lib/config/loadSpecifiedConfig';
import PackageJson from '$lib/PackageJson';
import { FIXTURES_PATH } from '../helper';
import fixtureConfig from '../fixtures/config/loadSpecifiedConfig/.depcoprc';

const MY_FIXTURES_PATH = path.join(
  FIXTURES_PATH,
  'config/loadSpecifiedConfig'
);

/** @test {loadSpecifiedConfig} */
describe('loadSpecifiedConfig()', () => {
  it('loads configurations from the config file', () => {
    const packageJson = new PackageJson('foo/bar', {});
    const config = loadSpecifiedConfig(packageJson, MY_FIXTURES_PATH);

    assert.deepEqual(config, fixtureConfig);
  });

  context('when package.json has configs', () => {
    it('loads configurations from package.json', () => {
      const packageJson = new PackageJson('foo/bar', {
        'depcop': { isPackageJson: true }
      });
      const config = loadSpecifiedConfig(packageJson, MY_FIXTURES_PATH);

      assert(config.isPackageJson);
    });
  });
});

