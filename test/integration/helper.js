import path from 'path';
import {
  makeDepcop as _makeDepcop
} from '$lib';

/**
 * The absolute path of fixtures directory.
 */
export const FIXTURES_PATH = path.resolve(__dirname, './fixtures');

/**
 * The absolute path of fixtures/lib directory.
 */
export const FIXTURES_LIB_PATH = path.join(FIXTURES_PATH, 'lib/**/*.js');

/**
 * The absolute path of fixtures/dev directory.
 */
export const FIXTURES_DEV_PATH = path.join(FIXTURES_PATH, 'dev/**/*.js');

/**
 * Make Depcop instance using package.json in {@link FIXTURES_PATH}.
 * @param {Object} options - Some required properties will be set automatically.
 * @param {boolean} noConfigLoading
 * @return {Depcop}
 */
export function makeDepcop(options = {}, noConfigLoading) {
  options.checks = options.checks || { missing: {}, unused: {}, strayed: {} };
  options.libSources = options.libSources || [FIXTURES_LIB_PATH];
  options.devSources = options.devSources || [FIXTURES_DEV_PATH];

  return _makeDepcop({
    cwd: FIXTURES_PATH,
    noConfigLoading,
    options
  });
}
