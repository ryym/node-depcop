
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
    return (fileInfo, moduleName) => {
      reporter.report(fileInfo.getPath(), moduleName);
    };
  }

  getReports() {
    return Object.keys(this._reporters).reduce((reports, name) => {
      const reporter = this._reporters[name];
      reports[name] = reporter.gatherReports();
      return reports;
    }, {});
  }
}

class Reporter {
  constructor(name, description) {
    this._name = name;
    this._data = { description, modules: {} };
  }

  getName() {
    return this._name;
  }

  report(filePath, moduleName) {
    const data = this._data;
    const moduleData = data.modules[moduleName] || { at: [] };

    moduleData.at.push({ path: filePath });
    data.modules[moduleName] = moduleData;
  }

  gatherReports() {
    const { description, modules } = this._data;
    const json = {};

    json.description = description;
    json.modules = Object.keys(modules)
      .sort()
      .map(moduleName => {
        return {
          moduleName,
          at: modules[moduleName].at
        };
      });

    return json;
  }
}
