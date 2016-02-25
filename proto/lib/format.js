'use strict';

module.exports = function format(results) {
  let output = '';
  Object.keys(results).forEach(checkName => {
    output += `${checkName}:\n`;
    const modules = results[checkName];

    Object.keys(modules).forEach(module => {
      output += `  ${module}\n`;

      const lines = modules[module];
      lines.forEach(line => {
        if (line.filename) {
          const pos = `${line.position.line}:${line.position.column}`;
          output += `    ! ${line.filename} ${pos}`
        }
      });
      output += '\n';
    });
  });
  return output;
}
