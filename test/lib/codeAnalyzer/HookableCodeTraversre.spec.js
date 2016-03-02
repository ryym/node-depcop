import assert from 'power-assert';
import sinon from 'sinon';
import HookableCodeTraverser from '$lib/codeAnalyzer/HookableCodeTraverser';

/** @test {HookableCodeTraverser} */
describe('HookableCodeTraverser', () => {

  it('registers hooks called when any specified node is found', () => {
    const traverser = new HookableCodeTraverser();
    const literals = sinon.spy();
    const identifiers = sinon.spy();
    const expressions = sinon.spy();

    traverser.addHook('Literal', literals);
    traverser.addHook('Identifier', identifiers);
    traverser.addHook('BinaryExpression', expressions);
    traverser.traverse('var a = 1 + (b - 2) * 3 / c;');

    const callCounts = [literals, identifiers, expressions].map(
      handler => handler.callCount
    );
    assert.deepEqual(callCounts, [3, 3, 4]);
  });

  it('calls each hook with the found node', () => {
    const traverser = new HookableCodeTraverser();
    const handler = sinon.spy();

    traverser.addHook('Identifier', handler);
    traverser.traverse('var a = b + c;');

    assert.deepEqual(
      handler.args.map(arg => arg[0].name),
      ['a', 'b', 'c']
    );
  });

  it('accepts additional arguments for hooks', () => {
    const traverser = new HookableCodeTraverser();
    const handler = sinon.spy();

    traverser.addHook('VariableDeclaration', handler);
    traverser.traverse('var a; var b; var c;', 1, 2, 3);

    assert.deepEqual(
      handler.args.map(arg => arg.splice(1)),
      [0, 0, 0].map(() => [1, 2, 3])
    );
  });

});
