import assert from 'power-assert';
import forEach from 'mocha-each';
import ImportedModule from '$lib/codeAnalyzer/ImportedModule';
import FileInfo from '$lib/FileInfo';

function file(path, isLib = true) {
  const type = FileInfo.Type[isLib ? 'LIB' : 'DEV'];
  return new FileInfo(path, type);
}

/** @test {ImportedModule} */
describe('ImportedModule', () => {

  /** @test {ImportedModule#getName} */
  describe('#getName()', () => {
    it('returns the module name', () => {
      const module = new ImportedModule('module-name', []);
      assert.equal(module.getName(), 'module-name');
    });
  });

  /** @test {ImportedModule#gtDependents} */
  describe('#getDependents()', () => {
    it('returns the array of dependent file infos', () => {
      const dependents = [
        file('foo.js'),
        file('foo/bar.js', false),
        file('baz/.baz.js')
      ];
      const module = new ImportedModule('module-name', dependents);
      const gotDependents = module.getDependents();

      assert.deepEqual(
        dependents.map(f => f.getPath()).sort(),
        gotDependents.map(f => f.getPath()).sort()
      );
    });
  });

  /** @test {ImportedModule#isUsedInLibSource} */
  describe('#isUsedInLibSource()', () => {
    forEach([[
      [ file('a', true), file('b', true) ], true
    ], [
      [ file('a', true), file('b', false) ], true
    ], [
      [ file('a', false), file('b', false) ], false
    ]])
    .it(
      'returns true if the module is used in lib code',
      (dependents, isUsed) => {
        const module = new ImportedModule('module-name', dependents);
        assert.equal(module.isUsedInLibSource(), isUsed);
      }
    );
  });

  /** @test {ImportedModule#isUsedInDevSource} */
  describe('#isUsedInDevSource()', () => {
    forEach([[
      [ file('a', false), file('b', false) ], true
    ], [
      [ file('a', false), file('b', true) ], true
    ], [
      [ file('a', true), file('b', true) ], false
    ]])
    .it(
      'returns true if the module is used in dev code',
      (dependents, isUsed) => {
        const module = new ImportedModule('module-name', dependents);
        assert.equal(module.isUsedInDevSource(), isUsed);
      }
    );
  });

});
