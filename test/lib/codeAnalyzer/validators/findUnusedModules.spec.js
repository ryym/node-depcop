import findUnusedModules from
  '$lib/codeAnalyzer/validators/findUnusedModules';
import {
  makePackageJson,
  makeValidatorTester,
  module
} from './helper';

const packageJson = makePackageJson({
  deps: ['lib-a', 'lib-b'],
  devDeps: ['dev-a', 'dev-b']
});

const testValidator = makeValidatorTester(
  packageJson, findUnusedModules
);

/** @test {findUnusedModules} */
describe('findUnusedModules()', () => {

  testValidator({}, [
    {
      title: 'reports nothing when all listed modules are used',
      modules: [
        module('lib-a', 'lib'),
        module('lib-b', 'lib'),
        module('dev-a', 'dev'),
        module('dev-b', 'dev')
      ],
      report: {
        dep: [],
        devDep: []
      }
    },
    {
      title: 'does not care about missing or strayed modules',
      modules: [
        module('lib-a', 'lib'),
        module('lib-b', 'dev'),
        module('lib-z', 'lib'),
        module('dev-a', 'dev'),
        module('dev-b', 'lib'),
        module('dev-z', 'dev')
      ],
      report: {
        dep: [],
        devDep: []
      }
    },
    {
      title: `reports as unused dependency if the module is
        listed in \`dependencies\``,
      modules: [
        module('dev-a', 'lib'),
        module('dev-b', 'dev')
      ],
      report: {
        dep: ['lib-a', 'lib-b'],
        devDep: []
      }
    },
    {
      title: `reports as unused dev-dependency if the module is
        listed in \`devDependencies\``,
      modules: [
        module('lib-a', 'lib'),
        module('lib-b', 'dev')
      ],
      report: {
        dep: [],
        devDep: ['dev-a', 'dev-b']
      }
    }
  ]);

  context('with `ignore` option', () => {
    testValidator({
      ignore: ['lib-a', 'dev-b']
    }, [
      {
        title: 'ignores modules that match with the specified patterns',
        modules: [
          module('lib-b', 'lib'),
          module('dev-a', 'dev')
        ],
        report: {
          dep: [],
          devDep: []
        }
      }
    ]);
  });

});
