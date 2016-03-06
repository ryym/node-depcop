
/**
 * InspectionRunner runs inspections and generate reports.
 */
export default class InspectionRunner {

  /**
   * Initialize InspectionRunner.
   * @param {Function[]} inspectors
   */
  constructor(inspectors) {
    this._inspectors = inspectors;
  }

  /**
   * Run inspections for the given modules.
   * @param {ImportedModule[]} importedModules
   * @return {Object} The result of the inspections.
   */
  runInspections(importedModules) {
    const reports = this._inspectors.map(
      inspect => inspect(importedModules)
    );
    return this._organizeReports(reports);
  }

  /**
   * Organize reports.
   * @private
   */
  _organizeReports(reports) {
    const warningCount = reports.reduce((count, report) => {
      const { dependencies, devDependencies } = report.modules;
      return count + dependencies.length + devDependencies.length;
    }, 0);

    return {
      warningCount,
      reports
    };
  }
}
