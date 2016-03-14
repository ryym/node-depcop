import espree from 'espree';
import assign from 'lodash.assign';

/**
 * Default options for `acorn#parse()`.
 * @private
 */
const DEFAULT_ACORN_OPTIONS = {
  ecmaVersion: 6,
  sourceType: 'module'
};

/**
 * Parser is a parser of ECMAScript code.
 */
export default class Parser {

  /**
   * Iniialize Parser.
   * @param {Object} parserOptions - The options for `espree#parse()`.
   * @see {@link https://github.com/eslint/espree}
   */
  constructor(options = {}) {
    this._options = this._constructOptions(options);
  }

  /**
   * Parse the given source code.
   * @throws ParsingError
   * @param {string} sourceCode
   * @return {ASTNode}
   */
  parse(sourceCode) {
    return espree.parse(sourceCode, this._options);
  }

  /**
   * Merge the given options with default options.
   * @private
   */
  _constructOptions(userOptions) {
    return assign(
      {}, DEFAULT_ACORN_OPTIONS, userOptions
    );
  }
}
