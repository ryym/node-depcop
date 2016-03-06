
/**
 * Create a function which returns true if the given
 * module should not be ignored.
 * @param {(string|Regex)[]} ignorePatterns
 * @return {Function}
 */
export function makeIgnorePatternChecker(ignorePatterns) {
  if (! Array.isArray(ignorePatterns)) {
    return () => true;
  }
  const patterns = ignorePatterns.map(p => new RegExp(p));

  return moduleName => patterns
    .filter(p => p.test(moduleName))
    .length === 0;
}
