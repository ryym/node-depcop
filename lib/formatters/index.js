import path from 'path';

/**
 * Load the specified formatter.
 */
export default function getFormatter(name) {
  const formatterPath = path.resolve(__dirname, `${name}`);
  return require(formatterPath).default;
}
