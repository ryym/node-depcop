
/**
 * Create a function which returns true if the given
 * module should not be ignored.
 * @param {string[]|RegExp[]} ignorePatterns
 * @return {Function}
 */
export function makeIgnorePatternChecker(ignorePatterns) {
  if (ignorePatterns == null) {
    return () => true;
  }

  if (! Array.isArray(ignorePatterns)) {
    const pattern = new RegExp(ignorePatterns);
    return moduleName => ! pattern.test(moduleName);
  }

  const patterns = ignorePatterns.map(p => new RegExp(p));
  return moduleName => patterns
    .filter(p => p.test(moduleName))
    .length === 0;
}
