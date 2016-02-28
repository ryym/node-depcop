import findup from 'findup-sync';

export default class PackageJson {
  constructor(cwd) {
    const path = findup('package.json', { cwd });
    this._json = require(path);
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
}
