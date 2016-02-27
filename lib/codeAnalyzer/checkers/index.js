import unlistedModuleFinder from './unlistedModuleFinder';

const checkers = {
  unlisted: unlistedModuleFinder
};

/**
 * Create a given name checker.
 */
export default function createChecker(
  name, packageJson, context
) {
  return checkers[name](packageJson, context);
}
