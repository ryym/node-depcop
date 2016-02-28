
/**
 * Context stores module names reported by
 * code checkers.
 */
export default class Context {
  constructor(packageJson) {
    this._packageJson = packageJson;
    this._reporters = {};
  }

  getPackageJson() {
    return this._packageJson;
  }

  makeReporter(name, description) {
    const reporter = new Reporter(name, description);
    this._reporters[name] = reporter;

    // TODO: Enable to store line and column info.
    return reporter.report.bind(reporter);
  }

  getReports() {
    return Object.keys(this._reporters).sort().map(name => {
      const reporter = this._reporters[name];
      return reporter.gatherReports();
    });
  }
}

class Reporter {
  constructor(name, description) {
    this._name = name;
    this._data = {
      description,
      dependencies: {},
      devDependencies: {}
    };
  }

  getName() {
    return this._name;
  }

  report(fileInfo, moduleName) {
    const data = this._data;
    let group = '';
    if (fileInfo.isLibSource()
      || data.dependencies.hasOwnProperty(moduleName)) {
      group = 'dependencies';
    }
    else {
      group = 'devDependencies';
    }

    const moduleData = data[group][moduleName] || { at: [] };

    moduleData.at.push({ path: fileInfo.getPath() });
    data[group][moduleName] = moduleData;
  }

  gatherReports() {
    const json = {};
    const {
      description, dependencies, devDependencies
    } = this._data;

    json.description = description;
    json.modules = {
      dependencies: this._extractLocations(dependencies),
      devDependencies: this._extractLocations(devDependencies)
    };
    return json;
  }

  _extractLocations(modules) {
    return Object.keys(modules)
      .sort()
      .map(moduleName => {
        return {
          moduleName,
          at: modules[moduleName].at
        };
      });
  }
}
