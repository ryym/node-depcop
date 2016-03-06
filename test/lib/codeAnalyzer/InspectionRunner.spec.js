import assert from 'power-assert';
import FileInfo from '$lib/FileInfo';
import Report from '$lib/codeAnalyzer/Report';
import InspectionRunner from '$lib/codeAnalyzer/InspectionRunner';

function makeReport(name, { dep, devDep }) {
  const fileInfo = FileInfo.asLib('shared');
  const report = new Report(name, name);

  dep.forEach(
    name => report.addDep(name, [fileInfo])
  );
  devDep.forEach(
    name => report.addDevDep(name, [fileInfo])
  );

  return report;
}

function makeInspectors(...reports) {
  return reports.map(report => {
    return () => report.toObject();
  });
}

/** @test {InspectionRunner} */
describe('InspectionRunner', () => {

  /** @test {InspectionRunner#runInspections} */
  describe('#runInspections()', () => {
    it('runs inspections and returns the result', () => {
      const inspectors = makeInspectors(
        makeReport('check1', {
          dep: ['a', 'b'],
          devDep: ['dev-a']
        }),
        makeReport('check2', {
          dep: ['a', 'c', 'e'],
          devDep: ['dev-d']
        }),
        makeReport('check3', {
          dep: ['x', 'c'],
          devDep: ['dev-a']
        })
      );

      const runner = new InspectionRunner(inspectors);
      const result = runner.runInspections();

      assert.deepEqual(
        [result.warningCount, result.reports.length],
        [10, 3]
      );
    });
  });

});
