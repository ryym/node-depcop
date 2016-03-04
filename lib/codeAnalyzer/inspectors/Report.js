
/**
 * Report collects reported module information
 * and generates a report.
 */
export default class Report {
  constructor(name, description) {
    this._data = {
      name,
      description,
      dependencies: {},
      devDependencies: {}
    };
  }

  onDep(moduleName, files) {
    this.report('dependencies', moduleName, files);
  }

  onDevDep(moduleName, files) {
    this.report('devDependencies', moduleName, files);
  }

  report(group, moduleName, files) {
    this._data[group][moduleName] = files;
  }

  toObject() {
    const {
      name, description, dependencies, devDependencies
    } = this._data;

    return {
      name,
      description,
      modules: {
        dependencies: this._extractLocations(dependencies),
        devDependencies: this._extractLocations(devDependencies)
      }
    };
  }

  _extractLocations(modules) {
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
