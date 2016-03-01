/**
 * Format results as JSON.
 */
export default function formatResults(results) {
  return JSON.stringify(results, 0, 2);
}
