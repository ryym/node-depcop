import assert from 'power-assert';
import configureDepcop from '$lib';
import { FIXTURES_PATH } from './helper';

const makeDepcop = configureDepcop(FIXTURES_PATH);

describe('depcop using config file', () => {
  it('loads a config file automatically', () => {
    const result = makeDepcop().generateReport();
    assert.equal(result.reports.length, 2);
  });
});
