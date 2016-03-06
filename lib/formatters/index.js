import path from 'path';

/**
 * Load the specified formatter.
 * @param {string} name - The formatter name.
 * @return {Function} The formatter.
 */
export default function getFormatter(name) {
  const formatterPath = path.resolve(__dirname, `${name}Formatter`);
  return require(formatterPath).default;
}
