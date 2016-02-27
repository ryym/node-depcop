import HookableCodeTraverser from './HookableCodeTraverser';

/**
 * CheckRunner parses given source code
 * and run checkers.
 */
export default class CheckRunner {
  constructor(checkers, parserOptions) {
    this._traverser = this._registerCheckers(
      checkers, parserOptions
    );
  }

  check(text, fileInfo) {
    this._traverser.traverse(text, fileInfo);
  }

  _registerCheckers(checkers, parserOptions) {
    const hooks = this._createHooks(checkers);
    return this._addHooks(hooks, parserOptions);
  }

  _createHooks(checkers) {
    return {
      'ImportDeclaration': (node, fileInfo) => {
        checkers.forEach(c => c.checkImport(node, fileInfo));
      }
    };
  }

  _addHooks(hooks, parserOptions) {
    const traverser = new HookableCodeTraverser(parserOptions);

    Object.keys(hooks).forEach(nodeType => {
      const hook = hooks[nodeType];
      traverser.addHook(nodeType, hook);
    });
    return traverser;
  }
}
