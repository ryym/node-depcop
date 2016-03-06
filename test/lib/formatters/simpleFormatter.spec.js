import simpleFormatter from '$lib/formatters/simpleFormatter';
import {
  unindent, report, testFormatter
} from './helper';

/** @test {simpleFormatter} */
describe('simpleFormatter', () => {
  testFormatter(
    'creates a string to be displayed in console',
    simpleFormatter, [{
      title: 'no warnings',
      input: {
        warningCount: 0,
        reports: [
          report('pass', { dep: [], devDep: [] }),
          report('success', { dep: [], devDep: [] })
        ]
      },
      output: ''
    }, {
      title: 'basic result',
      input: {
        warningCount: 2,
        reports: [
          report('Some modules found', {
            dep: ['foo', 'bar'],
            devDep: []
          })
        ]
      },
      output: unindent`
        Some modules found

          dependencies
            bar
              lib/path/to/bar
            foo
              lib/path/to/foo

      `
    }, {
      title: 'several warnings',
      input: {
        warningCount: 1,
        reports: [
          report('Check1', {
            dep: ['c1-lib1', 'c1-lib2'],
            devDep: ['c1-dev1']
          }),
          report('Check2', {
            dep: ['c2-lib1'],
            devDep: ['c2-dev1', 'c2-dev2', 'c2-dev3']
          }),
          report('Check3', {
            dep: ['c3-lib1', 'c3-lib2', 'c3-lib3'],
            devDep: []
          })
        ]
      },
      output: unindent`
        Check1

          dependencies
            c1-lib1
              lib/path/to/c1-lib1
            c1-lib2
              lib/path/to/c1-lib2

          devDependencies
            c1-dev1
              dev/path/to/c1-dev1

        Check2

          dependencies
            c2-lib1
              lib/path/to/c2-lib1

          devDependencies
            c2-dev1
              dev/path/to/c2-dev1
            c2-dev2
              dev/path/to/c2-dev2
            c2-dev3
              dev/path/to/c2-dev3

        Check3

          dependencies
            c3-lib1
              lib/path/to/c3-lib1
            c3-lib2
              lib/path/to/c3-lib2
            c3-lib3
              lib/path/to/c3-lib3

      `
    }]
  );
});
