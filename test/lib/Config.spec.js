import assert from 'power-assert';
import Config from '$lib/Config';
import { fixturePath } from './helper';

/** @test {Config} */
describe('Config', () => {

  /** @test {Config#listAllTargetFiles} */
  describe('#listAllTargetFiles()', () => {
    it('lists all target file paths', () => {
      const config = new Config({}, {
        libSources: [
          fixturePath('config/lib/a.js'),
          fixturePath('config/lib/sub/b.js')
        ],
        devSources: [
          fixturePath('config/test/a.test.js'),
          fixturePath('config/test/sub/b.test.js')
        ]
      });

      assert.deepEqual(
        config.listAllTargetFiles().map(f => f.getPath()),
        [
          fixturePath('config/lib/a.js'),
          fixturePath('config/lib/sub/b.js'),
          fixturePath('config/test/a.test.js'),
          fixturePath('config/test/sub/b.test.js')
        ]
      );
    });
  });

});

