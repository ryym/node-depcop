
/**
 * ImportedModule represents a module which is
 * imported in source code.
 */
export default class ImportedModule {

  /**
   * Initialize ImportedModule
   * @param {string} name - The module name.
   * @param {FileInfo[]} depenents - The array of dependents.
   */
  constructor(name, dependents) {
    this._name = name;
    this._libDependents = dependents.filter(
      d => d.isLibSource()
    );
    this._devDependents = dependents.filter(
      d => d.isDevSource()
    );
  }

  /**
   * Return the module name.
   * @return {string}
   */
  getName() {
    return this._name;
  }

  /**
   * Return the array of dependents.
   * @return {FileInfo[]}
   */
  getDependents() {
    return this._libDependents.concat(this._devDependents);
  }

  /**
   * Return whether the module is used in library code or not.
   * @return {boolean}
   */
  isUsedInLibSource() {
    return this._libDependents.length > 0;
  }

  /**
   * Return whether the module is used in development code or not.
   * @return {boolean}
   */
  isUsedInDevSource() {
    return this._devDependents.length > 0;
  }
}
