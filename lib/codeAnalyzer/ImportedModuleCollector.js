import builtins from 'builtins';
import HookableCodeTraverser from './HookableCodeTraverser';
import ImportedModule from './ImportedModule';

/**
 * ImportedModuleCollector traverses source code and
 * collects imported module inofmration.
 */
export default class ImportedModuleCollector {

  /**
   * Initialize ImportedModuleCollector
   * @param {Object} parserOptions - The options for `HookableCodeTraverser`.
   * @see {@link HookableCodeTraverser}
   */
  constructor(parserOptions) {
    const store = this._modules = {};
    const hooks = this._createHooks(store);
    this._traverser = this._createTraverser(hooks, parserOptions);

    this._builtins = builtins.reduce((m, name) => {
      m[name] = true;
      return m;
    }, {});
  }

  /**
   * Convert the given source code to the AST and traverse it
   * to collect information about imported modules.
   * @param {string} text
   * @param {FileInfo} fileInfo
   * @return {void}
   */
  searchImports(text, fileInfo) {
    this._traverser.traverse(text, fileInfo);
  }

  /**
   * Returns an array of imported module information
   * this instance currently stores.
   * @return {ImportedModule[]}
   */
  collectImportedModules() {
    return Object.keys(this._modules).map(name => {
      const dependents = this._modules[name];
      return new ImportedModule(name, dependents);
    });
  }

  /**
   * Clear all module information this instance currently stores.
   * @return {void}
   */
  clearFoundModules() {
    Object.keys(this._modules).forEach(name => {
      delete this._modules[name];
    });
  }

  /**
   * Create an instance of {@link HookableCodeTraverser}.
   * @private
   */
  _createTraverser(hooks, parserOptions) {
    const traverser = new HookableCodeTraverser(parserOptions);

    Object.keys(hooks).forEach(nodeType => {
      const hook = hooks[nodeType];
      traverser.addHook(nodeType, hook);
    });
    return traverser;
  }

  /**
   * Create hooks used to detect imported modules.
   * @private
   */
  _createHooks(modules) {
    return {
      'ImportDeclaration': (node, fileInfo) => {
        const moduleName = node.source.value;

        if (this._isRelativePath(moduleName) || this._isBuiltin(moduleName)) {
          return;
        }

        modules[moduleName] = modules[moduleName] || [];
        modules[moduleName].push(fileInfo);
      }
    };
  }

  /**
   * Return true if the given module is a relative path.
   * @private
   */
  _isRelativePath(moduleName) {
    return /^\.\.?\//.test(moduleName);
  }

  /**
   * Return true if the given module is a builtin module.
   * @private
   */
  _isBuiltin(moduleName) {
    return this._builtins[moduleName] === true;
  }
}
