'use strict';

const fs = require('fs');
const glob = require('glob');
const espree = require('espree');
const estraverse = require('estraverse');
const checkers = require('./checkers');

module.exports = function generateReports(packageJson, configs) {
  const results = {
    unlisted: {},
    unused: {}
  };

  let _currentFile = null;
  const context = {
    reportModule(checkName, module, loc) {
      const reports = results[checkName];
      if (! reports.hasOwnProperty(module)) {
        reports[module] = [];
      }
      reports[module].push({
        filename: _currentFile,
        position: loc ? loc.start : null
      });
    }
  }

  const files = glob.sync(configs.libSources, { realpath: true });
  const handlersList = Object.keys(checkers).map(name => {
    return checkers[name](packageJson);
  });

  files.forEach(file => {
    _currentFile = file;
    const content = fs.readFileSync(file, 'utf8');
    const ast = espree.parse(content, {
      ecmaVersion: 6,
      sourceType: 'module',
      loc: true
    })

    estraverse.traverse(ast, {
      enter(node) {
        handlersList.forEach(handlers => {
          var handler = handlers[node.type];
          handler && handler(node, context);
        });
      }
    })
  })
  _currentFile = null;

  handlersList.forEach(handlers => {
    var handler = handlers[':finish'];
    handler && handler(context);
  });

  return results;
}
