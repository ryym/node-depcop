const findup = require('findup-sync');
const generateReports = require('./generateReports');
const format = require('./format');

module.exports = function depcop(configs) {
  const packageJson = findAndParsePackageJson();
  const results = generateReports(packageJson, configs);
  return format(results);
}

function findAndParsePackageJson() {
  const path = findup('package.json', { cwd: __dirname });
  return require(path);
}
