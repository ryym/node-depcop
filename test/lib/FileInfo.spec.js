import assert from 'power-assert';
import FileInfo from '$lib/FileInfo';

/** @test {FileInfo} */
describe('FileInfo', () => {
  it('stores a path and type of a file', () => {
    const fileInfo = new FileInfo('path/to/file', FileInfo.Type.LIB);
    assert.deepEqual(
      [fileInfo.getPath(), fileInfo.getType()],
      ['path/to/file', FileInfo.Type.LIB]
    );
  });

  /** @test {FileInfo#isLibSource} */
  describe('#isLibSource()', () => {
    it('returns true if the file is library source', () => {
      const fileInfo = FileInfo.asLib('path/to/file');
      assert(fileInfo.isLibSource());
    });
  });

  /** @test {FileInfo#isDevSource} */
  describe('#isDevSource()', () => {
    it('returns true if the file is development source', () => {
      const fileInfo = FileInfo.asDev('path/to/file');
      assert(fileInfo.isDevSource());
    });
  });
});
