import assert from 'power-assert';
import path from 'path';
import {
  FIXTURES_PATH,
  makeDepcop
} from './helper';

function _makeDepcop(checks) {
  return makeDepcop({ checks }, true);
}

function at(fileName) {
  const filePath = path.resolve(FIXTURES_PATH, fileName);
  return { path: filePath };
}

function format(modules) {
  return Object.keys(modules).sort().map(moduleName => {
    return {
      moduleName,
      at: modules[moduleName]
    };
  });
}

function assertReported(reports, expectedReports) {
  const dependencies = format(expectedReports.dependencies);
  const devDependencies = format(expectedReports.devDependencies);
  assert.deepEqual(reports.modules, { dependencies, devDependencies });
}

/**
 * Depcop integration test.
 */
describe('depcop', () => {
  it('detects modules which are used but unlisted in dependencies', () => {
    const results = _makeDepcop({
      missing: { ignore: ['\\$special'] }
    }).generateReport();

    assertReported(results[0], {
      dependencies: {
        'ul_used-in-lib': [
          at('lib/a.js'),
          at('lib/sub/b.js')
        ],
        'ul_used-in-both': [
          at('lib/a.js'),
          at('lib/sub/b.js'),
          at('dev/a.js'),
          at('dev/sub/b.js')
        ]
      },
      devDependencies: {
        'ul_used-in-dev': [
          at('dev/a.js'),
          at('dev/sub/b.js')
        ]
      }
    });
  });

  it('detects modules which belongs to the wrong group', () => {
    const results = _makeDepcop({ strayed: {} }).generateReport();

    assertReported(results[0], {
      dependencies: {
        'lib_used-in-dev': [
          at('dev/a.js'),
          at('dev/sub/b.js')
        ]
      },
      devDependencies: {
        'dev_used-in-lib': [
          at('lib/a.js'),
          at('lib/sub/b.js')
        ],
        'dev_used-in-both': [
          at('lib/a.js'),
          at('lib/sub/b.js'),
          at('dev/a.js'),
          at('dev/sub/b.js')
        ]
      }
    });
  });

  it('detects modules which are listed in dependencies but never used', () => {
    const results = _makeDepcop({
      unused: { ignore: ['-somewhere$'] }
    }).generateReport();
    const pkgPath = path.join(FIXTURES_PATH, 'package.json');

    assertReported(results[0], {
      dependencies: {
        'lib_unused': [
          at(pkgPath)
        ]
      },
      devDependencies: {
        'dev_unused': [
          at(pkgPath)
        ]
      }
    });
  });

});
