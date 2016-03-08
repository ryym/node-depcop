import assert from 'power-assert';
import { makeDepcop } from '$lib';
import { FIXTURES_PATH } from './helper';

describe('depcop using config file', () => {
  it('loads a config file automatically', () => {
    const result = makeDepcop({
      cwd: FIXTURES_PATH
    })
    .generateReport();

    assert.equal(result.reports.length, 2);
  });
});
