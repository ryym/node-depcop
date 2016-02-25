
exports.unlistedChecker = function(pkg) {
  return {
    ImportDeclaration(node, context) {
      const source = node.source.value;
      if (/^\.\.?\//.test(source)) {
        return;
      }
      if (pkg.dependencies.hasOwnProperty(source)) {
        return;
      }
      context.reportModule('unlisted', source, node.loc);
    }
  }
}

exports.unusedChecker = function(pkg) {
  const _modules = {};
  return {
    ImportDeclaration(node, context) {
      const source = node.source.value;
      if (/^\.\.?\//.test(source)) {
        return;
      }
      _modules[source] = true;
    },
    ':finish': function(context) {
      Object.keys(pkg.dependencies).forEach(name => {
        if (! _modules.hasOwnProperty(name)) {
          context.reportModule('unused', name);
        }
      });
    }
  }
}
