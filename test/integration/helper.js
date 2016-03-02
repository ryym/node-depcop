import path from 'path';
import configureDepcop from '$lib';

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
 * @param {Object} config - Some required properties will be set automatically.
 * @param {boolean} disableDefaultConfig
 * @return {Depcop}
 */
export function makeDepcop(config = {}, disableDefaultConfig) {
  config.checks = config.checks || { missing: {}, unused: {}, strayed: {} };
  config.libSources = config.libSources || [FIXTURES_LIB_PATH];
  config.devSources = config.devSources || [FIXTURES_DEV_PATH];

  return _makeDepcop(config, disableDefaultConfig);
}

const _makeDepcop = configureDepcop(FIXTURES_PATH);
