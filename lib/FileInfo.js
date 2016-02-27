/**
 * FileInfo provides a type of the file (library source or not).
 */
export default class FileInfo {
  constructor(path, type) {
    this._path = path;
    this._type = type;
  }

  getPath() {
    return this._path;
  }

  getType() {
    return this._type;
  }

  isLibrarySource() {
    return this.getType() === FileInfo.Type.LIB;
  }

  isDevelopmentSource() {
    return this.getType() === FileInfo.Type.DEV;
  }
}

FileInfo.Type = {
  LIB: 'LIB',
  DEV: 'DEV',
  BARE_TEXT: 'BARE_TEXT'
};

FileInfo._anonymous = new FileInfo(
  '<text>',
  FileInfo.Type.BARE_TEXT
);

FileInfo.asAnonymous = function() {
  return FileInfo._anonymous;
};

FileInfo.asLib = function(path) {
  return new FileInfo(path, FileInfo.Type.LIB);
};

FileInfo.asDev = function(path) {
  return new FileInfo(path, FileInfo.Type.DEV);
};
