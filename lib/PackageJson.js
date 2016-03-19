import FileInfo from './FileInfo';
import assign from 'lodash.assign';

/**
 * PackageJson stores data in package.json with its path.
 */
export default class PackageJson {

  /**
   * Initialize PackageJson
   * @param {string} pkgPath - The path of package.json.
   * @param {Object} json - The parsed content of package.json.
   */
  constructor(pkgPath, json) {
    this._path = pkgPath;
    this._json = assign({}, json);
  }

  /**
   * Return true if the given module is listed in
   * `dependencies`.
   * @param {string} moduleName
   * @return {boolean}
   */
  hasDep(moduleName) {
    const deps = this.get('dependencies');
    return deps.hasOwnProperty(moduleName);
  }

  /**
   * Return true if the given module is listed in
   * `devDependencies`.
   * @param {string} moduleName
   * @return {boolean}
   */
  hasDevDep(moduleName) {
    const devDeps = this.get('devDependencies');
    return devDeps.hasOwnProperty(moduleName);
  }

  /**
   * Return true if the given module is listed in
   * `peerDependencies`.
   * @param {string} moduleName
   * @return {boolean}
   */
  hasPeerDep(moduleName) {
    const peerDeps = this.get('peerDependencies');
    return peerDeps.hasOwnProperty(moduleName);
  }

  /**
   * Get the value of the specified key.
   * If the key doesn't exist, 'defaultValue' is returned.
   * @param {string} key
   * @param {*} defaultValue - Returned if the key is not found.
   * @return {*} The value of the key.
   */
  get(key, defaultValue = {}) {
    return this._json[key] || defaultValue;
  }

  /**
   * Get the {@link FileInfo} instance of the package.json file.
   * @return {FileInfo}
   */
  getFileInfo() {
    return FileInfo.asDev(this._path);
  }
}
