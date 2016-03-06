import builtinsArray from 'builtins';

/**
 * The map of builtin module names.
 */
const BUILTINS = builtinsArray.reduce((m, name) => {
  m[name] = true;
  return m;
}, {});

/**
 * Create hooks which collect imported modules information.
 * @param {Object} modules - The object to store found modules.
 * @return {Object} The hooks.
 */
export function createHooks(modules) {
  function addModule(name, fileInfo) {
    modules[name] = modules[name] || [];
    modules[name].push(fileInfo);
  }

  return {

    // Handle statements like `import foo from 'foo';`.
    'ImportDeclaration': (node, fileInfo) => {
      const modulePath = node.source.value;

      if (shouldIgnore(modulePath)) {
        return;
      }

      const moduleName = normalizeModulePath(modulePath);
      addModule(moduleName, fileInfo);
    },

    // Handle statements like `var foo = require('foo');`.
    'CallExpression': (node, fileInfo) => {
      if (! (node.callee.name === 'require' && isValidRequire(node))) {
        return;
      }
      const modulePath = node.arguments[0].value;

      if (shouldIgnore(modulePath)) {
        return;
      }
      const moduleName = normalizeModulePath(modulePath);
      addModule(moduleName, fileInfo);
    }
  };
}

/**
 * Return true if the module path should be ignored.
 * @private
 */
function shouldIgnore(modulePath) {
  if (typeof modulePath !== 'string' || modulePath.trim() === '') {
    return true;
  }
  return isRelativePath(modulePath) || isBuiltin(modulePath);
}

/**
 * Normalize the given module path.
 * @private
 */
function normalizeModulePath(modulePath) {
  const slashIdx = modulePath.indexOf('/');
  if (slashIdx > 0) {
    return modulePath.substring(0, slashIdx);
  }
  return modulePath;
}

/**
 * Return true if the given module path is relative.
 * @private
 */
function isRelativePath(modulePath) {
  return /^\.\.?\//.test(modulePath);
}

/**
 * Return true if the given module is builtin.
 * @private
 */
function isBuiltin(modulePath) {
  return BUILTINS[modulePath] === true;
}

/**
 * Return true if the `require` call is valid.
 * @private
 */
function isValidRequire(node) {
  return node.arguments.length > 0
    && node.arguments[0].type === 'Literal';
}
