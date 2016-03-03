/**
 * Format results to JSON.
 * @param {Object[]} results
 * @return {string} The string of formatted results.
 */
export default function formatResults(results) {
  return JSON.stringify(results, 0, 2);
}
