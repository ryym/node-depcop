import assert from 'power-assert';
import path from 'path';
import configureDepcop from '$lib';

const FIXTURES_PATH = path.resolve(__dirname, './fixtures');
const makeDepcop = configureDepcop(__dirname);

function _makeDepcop(...checks) {
  return makeDepcop({
    checks,
    libSources: `${FIXTURES_PATH}/lib/**/*.js`
  });
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
  assert.deepEqual(reports.modules, format(expectedReports));
}

/**
 * Depcop integration test.
 */
describe('depcop', () => {
  it('detects modules which is used but unlisted in dependencies', () => {
    const results = _makeDepcop('unlisted').generateReport();

    assertReported(results.unlisted, {
      'ul_used-in-lib': [
        at('lib/a.js'),
        at('lib/sub/b.js')
      ],
      'ul_used-in-both': [
        at('lib/a.js'),
        at('lib/sub/b.js')
      ]
    });
  });

  it('detects modules which is listed in dependencies but never used');

  it('detects modules which belongs to the wrong group');
});
