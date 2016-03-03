import path from 'path';

/**
 * The absolute path of fixtures directory.
 */
export const FIXTURES_PATH = path.resolve(__dirname, './fixtures');

/**
 * Resolve given paths from {@link FIXTURES_PATH}.
 * @param {string...} paths
 * @return {string} The absolute path.
 */
export function fixturePath(...paths) {
  return path.resolve(FIXTURES_PATH, ...paths);
}
