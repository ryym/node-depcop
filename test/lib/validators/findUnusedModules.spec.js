import findUnusedModules from '$lib/validators/findUnusedModules';
import {
  makePackageJson,
  makeValidatorTester,
  module
} from './helper';

const pkgJson = makePackageJson({
  deps: ['lib-a', 'lib-b'],
  devDeps: ['dev-a', 'dev-b']
});

const pkgJsonWithPeer = makePackageJson({
  deps: ['lib-a', 'lib-b'],
  devDeps: ['dev-a', 'dev-b'],
  peerDeps: ['per-a']
});

const testValidator = makeValidatorTester(
  pkgJson, findUnusedModules
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

  context('when `peerDependencies` are defined', () => {
    makeValidatorTester(
      pkgJsonWithPeer, findUnusedModules
    )({}, [
      {
        title: `does not report if the module listed in \`peerDependencies\`
          is not used anywhere`,
        modules: [
          module('lib-a', 'lib'),
          module('dev-a', 'dev')
        ],
        report: {
          dep: ['lib-b'],
          devDep: ['dev-b']
        }
      }
    ]);
  });

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

  context('when only `dependencies` are target', () => {
    testValidator({
      devDependencies: false
    }, [
      {
        title: 'ignores unused `devDependencies`',
        modules: [
          module('lib-a', 'lib')
        ],
        report: {
          dep: ['lib-b'],
          devDep: []
        }
      }
    ]);
  });

  context('when only `devDependencies` are target', () => {
    makeValidatorTester(
      pkgJsonWithPeer, findUnusedModules
    )({
      dependencies: false
    }, [
      {
        title: 'ignores unused `dependencies`',
        modules: [
          module('dev-a', 'dev')
        ],
        report: {
          dep: [],
          devDep: ['dev-b']
        }
      }
    ]);
  });

});
