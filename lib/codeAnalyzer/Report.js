
/**
 * Report collects reported module information
 * and generates a report.
 */
export default class Report {

  /**
   * Initialize Report.
   * @param {string} name - The report name.
   * @param {string} description - The description of the report.
   */
  constructor(name, description) {
    this._data = {
      name,
      description,
      dependencies: {},
      devDependencies: {}
    };
  }

  /**
   * Add a dependency to the report.
   * @param {string} moduleName
   * @param {FileInfo[]} files - The files which depends on the module.
   * @return {void}
   */
  addDep(moduleName, files) {
    this._addModule('dependencies', moduleName, files);
  }

  /**
   * Add a dev-dependency to the report.
   * @param {string} moduleName
   * @param {FileInfo[]} files - The files which depends on the module.
   * @return {void}
   */
  addDevDep(moduleName, files) {
    this._addModule('devDependencies', moduleName, files);
  }

  /**
   * Return the object which has information about all reported modules.
   * @return {Object}
   */
  getReport() {
    const {
      name, description, dependencies, devDependencies
    } = this._data;

    return {
      name,
      description,
      modules: {
        dependencies: this._makeArray(dependencies),
        devDependencies: this._makeArray(devDependencies)
      }
    };
  }

  /**
   * Add a module to the report of the specified group.
   * @private
   */
  _addModule(group, moduleName, files) {
    this._data[group][moduleName] = files;
  }

  /**
   * Create an array of the reported module data.
   * @private
   */
  _makeArray(modules) {
    return Object.keys(modules)
      .sort()
      .map(moduleName => {
        const locations = modules[moduleName].map(fileInfo => {
          return { path: fileInfo.getPath() };
        });
        return {
          moduleName,
          at: locations
        };
      });
  }
}
