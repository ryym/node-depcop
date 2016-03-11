import findStrayedModules from
  '$lib/codeAnalyzer/validators/findStrayedModules';
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
  packageJson, findStrayedModules
);

/** @test {findStrayedModules} */
describe('findStrayedModules()', () => {

  testValidator({}, [
    {
      title: 'reports nothing when all modules are used in correct places',
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
      title: 'does not care about missing or unused modules',
      modules: [
        module('lib-a', 'lib'),
        module('lib-z', 'lib'),
        module('dev-a', 'dev'),
        module('dev-z', 'dev')
      ],
      report: {
        dep: [],
        devDep: []
      }
    },
    {
      title: `reports as strayed dependency if the module is
        listed in \`dependencies\``,
      modules: [
        module('lib-a', 'div'),
        module('lib-b', 'dev'),
        module('dev-a', 'dev')
      ],
      report: {
        dep: ['lib-a', 'lib-b'],
        devDep: []
      }
    },
    {
      title: `reports as strayed dev-dependency if the module is
        listed in \`devDependencies\``,
      modules: [
        module('lib-a', 'lib'),
        module('dev-a', 'lib'),
        module('dev-b', 'lib')
      ],
      report: {
        dep: [],
        devDep: ['dev-a', 'dev-b']
      }
    }
  ]);

});

