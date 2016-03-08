import path from 'path';

const DEFAULT_FORMATTER = path.resolve(__dirname, 'simpleFormatter');

/**
 * Load the specified formatter.
 * @param {string} name - The formatter name.
 * @return {Function} The formatter.
 */
export default function getFormatter(name) {
  if (name === 'default') {
    return require(DEFAULT_FORMATTER).default;
  }

  const formatterPath = path.resolve(__dirname, `${name}Formatter`);
  return require(formatterPath).default;
}
