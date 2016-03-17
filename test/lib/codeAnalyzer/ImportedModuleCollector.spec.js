import assert from 'power-assert';
import forEach from 'mocha-each';
import FileInfo from '$lib/FileInfo';
import ImportedModuleCollector from '$lib/codeAnalyzer/ImportedModuleCollector';

/** @test {ImportedModuleCollector} */
describe('ImportedModuleCollector', () => {
  const collector = new ImportedModuleCollector({
    ecmaVersion: 6,
    sourceType: 'module'
  });

  beforeEach(() => {
    collector.clearFoundModules();
  });

  forEach([
    ['recognizes various \'import\'s', {
      code: `
        import foo from 'foo';
        import * as bar from 'bar';
        import { member } from 'module1';
        import { ronald as ron } from 'module2';
        import { a, b, c as C } from 'module3';
        import almost, { member } from 'module4';
        import a, * as b from 'module5';
        import 'module6';
      `,
      modules: [
        'foo', 'bar',
        'module1', 'module2',
        'module3', 'module4',
        'module5', 'module6'
      ]
    }],
    ['recognizes \'export\'s that imports a module', {
      code: `
        export * from 'foo';
        export { a, b, c } from 'bar';
        export { a as A, b as B, c } from 'baz';
      `,
      modules: [
        'foo', 'bar', 'baz'
      ]
    }],
    ['recognizes \'require\' calls', {
      code: `
        var foo = require('foo');
        var bar = require('bar')({ option: null });
        var baz = baz || require('baz');
        require('qux');
        if (shouldUse) {
          var a = require('inner');
        }
      `,
      modules: [
        'foo', 'bar', 'baz',
        'qux', 'inner'
      ]
    }],
    ['ignores \'export\'s that just exports something', {
      code: `
      export { foo };
      export { a as default, b as B };
      export const module1 = 1;
      export function hello() {};
      export default function greet() {};
      `,
      modules: []
    }],
    ['ignores invalid loadings', {
      code: `
        import '';
        import ' ';

        export * from '';

        require(variable);
        require('exp' + 'ression');
        require(123);
        require('ok', 'ignore', 'rest', 'arguments');
        require();
        require('');
        require('  ');
      `,
      modules: ['ok']
    }],
    ['ignores relative paths', {
      code: `
        import foo from 'foo';
        import bar from './bar';
        import baz from '../baz';
        import qux from './some/dir/qux';
        import quux from '../../../quux';

        export * from './some/dir/qux';
        export { a } from '../../../quux';

        require('foo2');
        require('./bar');
        require('../baz');
        require('./some/dir/qux');
        require('../../../quux');
      `,
      modules: ['foo', 'foo2']
    }],
    ['ignores builtin modules (e.g. fs, path)', {
      code: `
        import fs from 'fs';
        import _foo from 'foo';
        import path from 'path';
        import crypto from 'crypto';
        import _bar from 'bar';
        import assert from 'assert';
        import _baz from 'baz';

        export * from 'path';
        export { equal } from 'assert';

        if (shouldLoad) {
          var fs = require('fs');
          var _foo = require('foo2');
          var path = require('path');
          var crypto = require('crypto');
          var _bar = require('bar2');
          var assert = require('assert');
          var _baz = require('baz2');
        }
      `,
      modules: [
        'foo', 'bar', 'baz',
        'foo2', 'bar2', 'baz2'
      ]
    }],
    ['ignores modules in subdirectories', {
      code: `
        import foo from 'foo';
        import bar from 'bar/sub/a';
        import bar from 'bar/sub/b';
        import baz from 'baz/inner/SomeClass';

        export * from 'qux/sub/a';
        export * from 'quux/inner/SomeClass';

        if (shouldLoad) {
          var foo = require('foo2');
          var bar = require('bar2/sub/a');
          var bar = require('bar2/sub/b');
          var baz = require('baz2/inner/SomeClass');
        }
      `,
      modules: [
        'foo', 'bar', 'baz',
        'qux', 'quux',
        'foo2', 'bar2', 'baz2'
      ]
    }]
  ])
  .it('collects module information (%s)', (_, data) => {
    collector.searchImports(data.code, FileInfo.asAnonymous());
    const modules = collector.collectImportedModules();

    assert.deepEqual(
      modules.map(m => m.getName()),
      data.modules
    );
  });

  it('colletcs modules with a file information that uses the modules', () => {
    [
      [
        FileInfo.asLib('a.js'), `
          import module1 from 'module1';
          import module2 from 'module2'
        `
      ], [
        FileInfo.asLib('b.js'), `
          import module1 from 'module1';
          var module3 = require('module3');
        `
      ], [
        FileInfo.asLib('c.js'), `
          var module2 = require('module2');
          import module3 from 'module3';
        `
      ]
    ]
    .forEach(([fileInfo, code]) => {
      collector.searchImports(code, fileInfo);
    });

    const modules = collector.collectImportedModules()
      .reduce((ms, module) => {
        const paths = module.getDependents().map(f => f.getPath());
        ms[module.getName()] = paths;
        return ms;
      }, {});

    assert.deepEqual(modules, {
      module1: ['a.js', 'b.js'],
      module2: ['a.js', 'c.js'],
      module3: ['b.js', 'c.js']
    });
  });

});
