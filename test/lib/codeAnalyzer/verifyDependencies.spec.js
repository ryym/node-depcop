import assert from 'power-assert';
import PackageJson from '$lib/PackageJson';
import Config from '$lib/Config';
import verifyDependencies from '$lib/codeAnalyzer/verifyDependencies';

const packageJson = new PackageJson('path/to/pkg', {
  dependencies: {
    'lib-a': '',
    'lib-b': ''
  },
  devDependencies: {
    'dev-a': '',
    'dev-b': ''
  }
});

/**
 * Run {@link verifyDependencies} and compare its result with
 * the expected one.
 * @private
 */
function testVerifier(settings) {
  settings.forEach(setting => {
    it(`${setting.title}`, () => {
      const { files, options, result } = setting;
      const config = new Config(options, makeFilePaths(files));
      const readFile = name => files[name];

      const actual = verifyDependencies(packageJson, config, readFile);
      const warned = actual.warningCount > 0;
      const reports = actual.reports.map(r => r.name);

      assert.deepEqual({ warned, reports }, result);
    });
  });
}

function makeFilePaths(files) {
  const names = Object.keys(files);
  return {
    libSources: names.filter(f => ! f.startsWith('dev')),
    devSources: names.filter(f => f.startsWith('dev'))
  };
}

describe('verifyDependencies', () => {
  testVerifier([
    {
      title: 'does nothing if options are empty',
      files: {
        a: 'import missing from "missing";'
      },
      options: {
        checks: {}
      },
      result: {
        warned: false,
        reports: []
      }
    },
    {
      title: 'runs the specified validations only',
      files: {
        a: 'import libA from "lib-a";',
        b: 'import missing from "missing";',
        devA: 'import devA from "dev-a";',
        devB: 'import devB from "dev-b";'
      },
      options: {
        checks: {
          unused: {}
        }
      },
      result: {
        warned: true,
        reports: ['unused']
      }
    }
  ]);
});
