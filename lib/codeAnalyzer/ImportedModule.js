
/**
 * ImportedModule represents a module which is
 * imported in source code.
 */
export default class ImportedModule {
  constructor(name, dependents) {
    this._name = name;
    this._libDependents = dependents.filter(
      d => d.isLibSource()
    );
    this._devDependents = dependents.filter(
      d => d.isDevSource()
    );
  }

  getName() {
    return this._name;
  }

  getDependents() {
    return this._libDependents.concat(this._devDependents);
  }

  isUsedInLibSource() {
    return this._libDependents.length > 0;
  }

  isUsedInDevSource() {
    return this._devDependents.length > 0;
  }
}
