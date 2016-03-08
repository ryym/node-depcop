
/**
 * Merge two options.
 * @param {Object} options
 * @param {Object} other
 * @return {Object} The new merged options.
 */
export default function mergeOptions(options, other) {
  return Object.assign({}, options, other);  // XXX: Merge deeply.
}
