import findup from 'findup-sync';
import FileInfo from './FileInfo';

/**
 * PackageJson stores data in package.json with its path.
 */
export default class PackageJson {
  constructor(cwd) {
    this._path = findup('package.json', { cwd });
    this._json = require(this._path);
  }

  hasDep(moduleName) {
    const deps = this.get('dependencies');
    return deps.hasOwnProperty(moduleName);
  }

  hasDevDep(moduleName) {
    const devDeps = this.get('devDependencies');
    return devDeps.hasOwnProperty(moduleName);
  }

  get(entry, defaultValue = {}) {
    return this._json[entry] || defaultValue;
  }

  getFileInfo() {
    return FileInfo.asDev(this._path);
  }
}
