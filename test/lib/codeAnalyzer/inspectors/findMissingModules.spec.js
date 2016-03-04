import findMissingModules from
  '$lib/codeAnalyzer/inspectors/findMissingModules';
import {
  makePackageJson,
  makeInspectorTester,
  module
} from './helper';

const packageJson = makePackageJson({
  deps: ['lib-a', 'lib-b'],
  devDeps: ['dev-a', 'dev-b']
});

const testInspector = makeInspectorTester(
  packageJson, findMissingModules
);

/** @test {findMissingModules} */
describe('findMissingModules()', () => {

  testInspector({}, [
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
    testInspector({
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

});
