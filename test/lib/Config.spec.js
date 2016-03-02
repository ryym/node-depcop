import assert from 'power-assert';
import Config from '$lib/Config';
import { fixturePath } from './helper';

/** @test {Config} */
describe('Config', () => {

  /** @test {Config#listAllTargetFiles} */
  describe('Config#listAllTargetFiles()', () => {
    it('lists all target file paths', () => {
      const config = new Config({
        checks: {},
        libSources: [fixturePath('lib/**/*.js')],
        devSources: [fixturePath('test/**/*.test.js')]
      });

      assert.deepEqual(
        config.listAllTargetFiles().map(f => f.getPath()),
        [
          fixturePath('lib/a.js'),
          fixturePath('lib/sub/b.js'),
          fixturePath('test/a.test.js'),
          fixturePath('test/sub/b.test.js')
        ]
      );
    });
  });

});

