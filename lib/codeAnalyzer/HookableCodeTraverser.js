import EventEmitter from 'events';
import espree from 'espree';
import estraverse from 'estraverse';

/**
 * HookableCodeTraverser provides a way to visit
 * each node of AST by event emitter method.
 */
export default class HookableCodeTraverser {
  constructor(parserOptions) {
    this._emitter = new EventEmitter();
    this._parserOptions = parserOptions;
  }

  addHook(nodeType, listener) {
    this._emitter.on(nodeType, listener);
  }

  traverse(sourceCode, ...additionalArgs) {
    const emitter = this._emitter;
    const ast = this._parse(sourceCode);

    this._traverse(ast, {
      enter(node) {
        emitter.emit(node.type, node, ...additionalArgs);
      }
    });
  }

  _parse(sourceCode) {
    return espree.parse(sourceCode, this._parserOptions);
  }

  _traverse(ast, handlers) {
    return estraverse.traverse(ast, handlers);
  }
}
