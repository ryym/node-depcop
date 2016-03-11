import builtinsArray from 'builtins';

/**
 * The map of builtin module names.
 */
const BUILTINS = builtinsArray.reduce((m, name) => {
  m[name] = true;
  return m;
}, {});

/**
 * Return true if the `require` call is valid.
 * @param {ASTNode} node
 * @return {boolean}
 */
export function isValidRequire(node) {
  return node.arguments.length > 0
    && node.arguments[0].type === 'Literal';
}

/**
 * Return true if the module path should be ignored.
 * e.g. relative paths, builtins.
 * @param {string} modulePath
 * @return {boolean}
 */
export function shouldIgnore(modulePath) {
  if (typeof modulePath !== 'string' || modulePath.trim() === '') {
    return true;
  }
  return isRelativePath(modulePath) || isBuiltin(modulePath);
}

/**
 * Normalize the given module path.
 * e.g. 'babel-core/register' -> 'babel-core'.
 * @param {string} modulePath
 * @return {string} The normalized path.
 */
export function normalizeModulePath(modulePath) {
  const slashIdx = modulePath.indexOf('/');
  if (slashIdx > 0) {
    return modulePath.substring(0, slashIdx);
  }
  return modulePath;
}

/**
 * Return true if the given module path is relative.
 * @param {string} modulePath
 * @return {boolean}
 */
export function isRelativePath(modulePath) {
  return /^\.\.?\//.test(modulePath);
}

/**
 * Return true if the given module is builtin.
 * @param {string} modulePath
 * @return {boolean}
 */
export function isBuiltin(modulePath) {
  return BUILTINS[modulePath] === true;
}
