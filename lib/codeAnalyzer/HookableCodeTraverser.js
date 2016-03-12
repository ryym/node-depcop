import EventEmitter from 'events';
import espree from 'espree';
import estraverse from 'estraverse';

/**
 * HookableCodeTraverser provides a way to visit
 * each node of AST using an event emitter.
 */
export default class HookableCodeTraverser {

  /**
   * Initialize HookableCodeTraverser.
   * @param {Object} parserOptions - The options for `espree#parse()`.
   * @see {@link https://github.com/eslint/espree}
   */
  constructor(parserOptions) {
    this._emitter = new EventEmitter();
    this._parserOptions = parserOptions;
  }

  /**
   * Add a hook for the specified node type. `listener` will be
   * called when {@link HookableCodeTraverser#traverse} encounters
   * the node.
   * @param {string} nodeType
   * @param {Function} listener - Takes the encountered node as a
   *     first argument.
   * @return {void}
   */
  addHook(nodeType, listener) {
    this._emitter.on(nodeType, listener);
  }

  /**
   * Parse the given code and travere the AST.
   * Registered hooks are called during traversing.
   * @param {string} sourceCode
   * @param {...*} additionalArgs - Passed to each hook as arguments
   *     after the node.
   * @return {void}
   */
  traverse(sourceCode, ...additionalArgs) {
    const emitter = this._emitter;
    const ast = this._parse(sourceCode);

    this._traverse(ast, {
      enter(node) {
        emitter.emit(node.type, node, ...additionalArgs);
      },
      fallback: 'iteration'
    });
  }

  /**
   * Convert the given code to AST.
   * @private
   */
  _parse(sourceCode) {
    return espree.parse(sourceCode, this._parserOptions);
  }

  /**
   * Traverse the given AST.
   * @private
   */
  _traverse(ast, handlers) {
    return estraverse.traverse(ast, handlers);
  }
}
