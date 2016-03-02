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
    const packageJson = new PackageJson(FIXTURES_PATH);
    const config = loadConfig(packageJson, MY_FIXTURES_PATH);

    assert.deepEqual(config, fixtureConfig);
  });

  context('when package.json has configs', () => {
    it('loads configurations from package.json', () => {
      const pkgDir = path.join(MY_FIXTURES_PATH, 'pkg');
      const packageJson = new PackageJson(pkgDir);
      const config = loadConfig(packageJson, MY_FIXTURES_PATH);

      assert(config.isPackageJson);
    });
  });
});

