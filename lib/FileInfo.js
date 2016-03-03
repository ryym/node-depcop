/**
 * FileInfo stores information about a file.
 */
export default class FileInfo {

  /**
   * Initialize FileInfo.
   * @param {string} path - The path of the file.
   * @param {string} type - See {@link FileInfo.Type}
   */
  constructor(path, type) {
    this._path = path;
    this._type = type;
  }

  /**
   * Return the file path.
   * @return {string}
   */
  getPath() {
    return this._path;
  }

  /**
   * Return the file type.
   * @return {string}
   */
  getType() {
    return this._type;
  }

  /**
   * Return true if the file type is
   * {@link FileType.Type.LIB}.
   * @return {boolean}
   */
  isLibSource() {
    return this.getType() === FileInfo.Type.LIB;
  }

  /**
   * Return true if the file type is
   * {@link FileType.Type.DEV}.
   * @return {boolean}
   */
  isDevSource() {
    return this.getType() === FileInfo.Type.DEV;
  }
}

/**
 * FileInfo.Type represents two types of files.
 *   * LIB - Ordinary source files.
 *   * DEV - Files for development like tests, build scripts, etc.
 *   * BARE_TEXT - A text that doesn't be included any file.
 */
FileInfo.Type = {
  LIB: 'LIB',
  DEV: 'DEV',
  BARE_TEXT: 'BARE_TEXT'
};

/**
 * Create new {@link FileInfo} without file information.
 */
FileInfo.asAnonymous = function() {
  return FileInfo._anonymous;
};

/**
 * Create new {@link FileInfo} of library file.
 */
FileInfo.asLib = function(path) {
  return new FileInfo(path, FileInfo.Type.LIB);
};

/**
 * Create new {@link FileInfo} of development file.
 */
FileInfo.asDev = function(path) {
  return new FileInfo(path, FileInfo.Type.DEV);
};

/**
 * A singleton of anonymous {@link FileInfo}.
 * @private
 */
FileInfo._anonymous = new FileInfo(
  '<text>',
  FileInfo.Type.BARE_TEXT
);

