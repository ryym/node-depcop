import assert from 'power-assert';
import forEach from 'mocha-each';
import { parseArgv } from '$lib/cli/optionParser';

/** @test {parseArgv} */
describe('parseArgv()', () => {

  function toArgv(args) {
    return ['node', 'path/to/file'].concat(args);
  }

  // Tests for invalid values.
  forEach([
    [['--invalid']],
    [['-z']],
    [['-ab']],
    [['-l', '[a', ',b]']],
    [['--missing', '{ignore:a,b,c}']]  // Required brachets.
  ])
  .it('returns an error for invalid args like: %j', args => {
    const { error } = parseArgv(toArgv(args));
    assert(error instanceof Error);
  });

  // Tests for valid values.
  forEach([
    {
      args: [],
      options: { checks: {} }
    }, {
      args: ['--format', 'json'],
      options: {
        checks: {},
        format: 'json'
      }
    }, {
      args: ['--lib-sources', 'a.js,b.js,c.js'],
      options: {
        checks: {},
        libSources: ['a.js', 'b.js', 'c.js']
      }
    }, {
      args: ['--missing', '-f', 'pretty'],
      options: {
        checks: {
          missing: {}
        },
        format: 'pretty'
      }
    }, {
      args: ['--missing', '--unused'],
      options: {
        checks: {
          missing: {},
          unused: {}
        }
      }
    }, {
      args: [
        '--missing', 'ignore:foo',
        '--strayed', '--no-depcoprc'
      ],
      options: {
        checks: {
          missing: {
            ignore: 'foo'
          },
          strayed: {}
        }
      }
    }, {
      args: [
        '-l', 'a',
        '-d', '[x,y]',
        '-l', 'b,c',
        '--dev-sources', 'z'
      ],
      options: {
        checks: {},
        devSources: ['x', 'y', 'z'],
        libSources: ['a', 'b', 'c']
      }
    }, {
      args: [
        '-l', 'x,y',
        '--unused', 'ignore:[foo,bar]',
        '--missing', '{ignore:[a,b,c]}',
        '-f', 'json'
      ],
      options: {
        checks: {
          unused: {
            ignore: ['foo', 'bar']
          },
          missing: {
            ignore: ['a', 'b', 'c']
          }
        },
        libSources: ['x', 'y'],
        format: 'json'
      }
    },
    {
      args: ['--parser-options', 'ecmaFeatures:{jsx:true}'],
      options: {
        checks: {},
        parserOptions: {
          ecmaFeatures: { jsx: true }
        }
      }
    }
  ])
  .it(
    ({ args }) => `parses argv and generates normalized options: ${args}`,
    ({ args, options }) => {
      const { depcopOptions } = parseArgv(toArgv(args));
      assert.deepEqual(depcopOptions, options);
    }
  );

});
