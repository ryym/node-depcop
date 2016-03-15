import {
  isValidRequire,
  shouldIgnore,
  normalizeModulePath
} from './helper';

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
