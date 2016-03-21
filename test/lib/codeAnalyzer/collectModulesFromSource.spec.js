import assert from 'power-assert';
import FileInfo from '$lib/FileInfo';
import { unindent } from '$lib/util';
import collectModulesFromSource from
  '$lib/codeAnalyzer/collectModulesFromSource';

/**
 * Run {@link collectModulesFromSource} and
 * ensure it can collect modules from various source code.
 * @private
 */
function testCollector(settings) {
  settings.forEach(setting => {
    it(`${setting.title}`, () => {
      const { files, parserOptions, moduleCount } = setting;
      const targetFiles = makeFilePaths(files);
      const readFile = name => files[name];

      const modules = collectModulesFromSource({
        parserOptions, targetFiles, readFile
      });

      assert.equal(modules.length, moduleCount);
    });
  });
}

function makeFilePaths(files) {
  return Object.keys(files).map(name => {
    const isDev = name.startsWith('dev');
    return isDev ? FileInfo.asDev(name) : FileInfo.asLib(name);
  });
}

/** @test {collectModulesFromSource} */
describe('collectModulesFromSource', () => {
  testCollector([
    {
      title: 'collects modules from the source code',
      files: {
        a: 'import libA from "lib-a";',
        b: 'import libB from "lib-b";',
        devA: 'import devA from "dev-a";',
        devB: 'import devB from "dev-b";'
      },
      parserOptions: {},
      moduleCount: 4
    },
    {
      title: 'accepts a script file starting with shebang',
      files: {
        a: unindent`#!/usr/bin/env node
          var foo = require('foo');
        `
      },
      parserOptions: {},
      moduleCount: 1
    }
  ]);

  context('with appropriate parser options', () => {
    testCollector([
      {
        title: 'accepts code written in ES7',
        files: {
          a: `
            import foo from 'foo';
            const cubed = 2 ** 3;
          `
        },
        parserOptions: {
          ecmaVersion: 7
        },
        moduleCount: 1
      },
      {
        title: 'accepts code written in JSX format',
        files: {
          a: `
            import React from 'react';
            import ReactDom from 'react-dom';

            function Form(props) {
              return (
                <Container name="foo">
                  <App key="bar" />
                </Container>
              );
            }
          `
        },
        parserOptions: {
          ecmaFeatures: { jsx: true }
        },
        moduleCount: 2
      }
    ]);
  });

});
