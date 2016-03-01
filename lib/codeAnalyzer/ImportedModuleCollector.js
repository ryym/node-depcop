import HookableCodeTraverser from './HookableCodeTraverser';
import ImportedModule from './ImportedModule';

/**
 * ImportedModuleCollector traverses source code and
 * collect imported module inofmration.
 */
export default class ImportedModuleCollector {
  constructor(parserOptions) {
    const store = this._modules = {};
    const hooks = this._createHooks(store);
    this._traverser = this._createTraverser(hooks, parserOptions);
  }

  searchImports(text, fileInfo) {
    this._traverser.traverse(text, fileInfo);
  }

  collectImportedModules() {
    return Object.keys(this._modules).map(name => {
      const dependents = this._modules[name];
      return new ImportedModule(name, dependents);
    });
  }

  _createTraverser(hooks, parserOptions) {
    const traverser = new HookableCodeTraverser(parserOptions);

    Object.keys(hooks).forEach(nodeType => {
      const hook = hooks[nodeType];
      traverser.addHook(nodeType, hook);
    });
    return traverser;
  }

  _createHooks(modules) {
    return {
      'ImportDeclaration': (node, fileInfo) => {
        const moduleName = node.source.value;

        if (this._isRelativePath(moduleName)) {
          return;
        }

        modules[moduleName] = modules[moduleName] || [];
        modules[moduleName].push(fileInfo);
      }
    };
  }

  _isRelativePath(moduleName) {
    return /^\.\.?\//.test(moduleName);
  }
}
