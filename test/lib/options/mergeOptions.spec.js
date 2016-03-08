import assert from 'power-assert';
import forEach from 'mocha-each';
import mergeOptions from '$lib/options/mergeOptions';

describe('mergeOptions()', () => {
  forEach([[
    [{
      formatter: 'simple',
      foo: 123, bar: true
    }, {
      foo: 456, bar: false
    }],
    {
      formatter: 'simple',
      foo: 456, bar: false
    }
  ], [
    [{
      libSources: ['first-lib'],
      checks: {
        missing: {},
        unused: {}
      }
    }, {
      libSources: ['second-lib'],
      checks: {
        missing: {
          ignore: ['somefile']
        },
        strayed: {}
      }
    }],
    {
      libSources: ['first-lib', 'second-lib'],
      checks: {
        missing: {
          ignore: ['somefile']
        },
        unused: {},
        strayed: {}
      }
    }
  ]])
  .it('merges options deeply', (optionArray, expected) => {
    const actual = mergeOptions(...optionArray);
    assert.deepEqual(actual, expected);
  });

});
