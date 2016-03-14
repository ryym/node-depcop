import findMissingModules from
  '$lib/codeAnalyzer/validators/findMissingModules';
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
  packageJson, findMissingModules
);

/** @test {findMissingModules} */
describe('findMissingModules()', () => {

  testValidator({}, [
    {
      title: 'reports nothing when there are no missing modules',
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
      title: 'does not care about unused modules',
      modules: [
        module('lib-a', 'lib'),
        module('dev-b', 'dev')
      ],
      report: {
        dep: [],
        devDep: []
      }
    },
    {
      title: 'does not care about strayed modules',
      modules: [
        module('lib-a', 'lib'),
        module('lib-b', 'dev'),
        module('dev-a', 'lib'),
        module('dev-b', 'dev')
      ],
      report: {
        dep: [],
        devDep: []
      }
    },
    {
      title: `reports as missing dependency if the module
        is used in lib code`,
      modules: [
        module('lib-a', 'lib'),
        module('lib-b', 'lib'),
        module('lib-c', 'lib'),
        module('dev-a', 'lib'),
        module('dev-b', 'dev'),
        module('dev-c', 'lib', 'dev'),
        module('dev-d', 'dev')
      ],
      report: {
        dep: ['lib-c', 'dev-c'],
        devDep: ['dev-d']
      }
    },
    {
      title: `reports as missing dev-dependency if the module
        is used only in dev code`,
      modules: [
        module('lib-a', 'lib'),
        module('lib-b', 'lib'),
        module('lib-c', 'dev'),
        module('lib-d', 'lib', 'dev'),
        module('dev-a', 'lib'),
        module('dev-b', 'dev'),
        module('dev-c', 'dev')
      ],
      report: {
        dep: ['lib-d'],
        devDep: ['lib-c', 'dev-c']
      }
    }
  ]);

  context('with `ignore` option', () => {
    testValidator({
      ignore: ['ign-', '-mis']
    }, [
      {
        title: 'ignores modules that match with the specified patterns',
        modules: [
          module('ign-a', 'lib'),
          module('b-mis', 'lib'),
          module('lib-c', 'lib'),
          module('ign-a', 'dev'),
          module('b-mis', 'dev'),
          module('dev-c', 'dev')
        ],
        report: {
          dep: ['lib-c'],
          devDep: ['dev-c']
        }
      }
    ]);
  });

  context('when only `dependencies` are target', () => {
    testValidator({
      devDependencies: false
    }, [
      {
        title: 'ignores missing `devDependencies`',
        modules: [
          module('lib-a', 'lib'),
          module('lib-b', 'lib'),
          module('lib-c', 'lib'),
          module('dev-a', 'dev'),
          module('dev-b', 'dev'),
          module('dev-c', 'dev')
        ],
        report: {
          dep: ['lib-c'],
          devDep: []
        }
      }
    ]);
  });

  context('when only `devDependencies` are target', () => {
    testValidator({
      dependencies: false
    }, [
      {
        title: 'ignores missing `dependencies`',
        modules: [
          module('lib-a', 'lib'),
          module('lib-b', 'lib'),
          module('lib-c', 'lib'),
          module('dev-a', 'dev'),
          module('dev-b', 'dev'),
          module('dev-c', 'dev')
        ],
        report: {
          dep: [],
          devDep: ['dev-c']
        }
      }
    ]);
  });

});
