import assert from 'power-assert';
import PackageJson from '$lib/PackageJson';

/** @test {PackageJson} */
describe('PackageJson', () => {
  const packageJson = new PackageJson(
    'path/of/the/package.json',
    {
      'name': 'package-json-name',
      'dependencies': {
        'foo': '1.0.0'
      },
      'devDependencies': {
        'dev-foo': '1.0.0'
      }
    }
  );

  /** @test {PackageJson#get} */
  describe('#get()', () => {
    it('returns the value of the specified key', () => {
      assert.equal(
        packageJson.get('name'),
        'package-json-name'
      );
    });

    context('when the specified key is not found', () => {
      it('returns the default value specified as a second argument', () => {
        assert.equal(
          packageJson.get('nothing', 'default-value'),
          'default-value'
        );
      });
    });
  });

  /** @test {PackageJson#hasDep} */
  describe('#hasDep()', () => {
    it('checks if the module is in `dependencies`', () => {
      assert.deepEqual(
        [packageJson.hasDep('foo'), packageJson.hasDep('unknown')],
        [true, false]
      );
    });
  });

  /** @test {PackageJson#hasDevDep} */
  describe('#hasDevDep()', () => {
    it('checks if the module is in `devDependencies`', () => {
      assert.deepEqual(
        [packageJson.hasDevDep('dev-foo'), packageJson.hasDevDep('unknown')],
        [true, false]
      );
    });
  });

  /** @test {PackageJson#getFileInfo} */
  describe('#getFileInfo()', () => {
    it('returns FileInfo instance about package.json', () => {
      assert.deepEqual(
        packageJson.getFileInfo().getPath(),
        'path/of/the/package.json'
      );
    });
  });
});
