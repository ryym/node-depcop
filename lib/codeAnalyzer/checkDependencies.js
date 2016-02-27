import createChecker from './checkers';
import Context from './Context';
import CheckRunner from './CheckRunner';

function loadCheckers(config, context) {
  return config.getEnabledCheckers().map(name => {
    return createChecker(name, context);
  });
}

const parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
  loc: true
};

/**
 * Verify dependencies by searching source code.
 */
export default function checkDependencies(
  packageJson, config, readFile
) {
  const context = new Context(packageJson);
  const checkers = loadCheckers(config, context);
  const runner = new CheckRunner(checkers, parserOptions);
  const fileInfos = config.listAllTargetFiles();

  fileInfos.forEach(fileInfo => {
    const content = readFile(fileInfo.getPath());
    runner.check(content, fileInfo);
  });

  return context.getReports();
}
