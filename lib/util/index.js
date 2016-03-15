
/**
 * A tagged template string processor to strip
 * unnecessary indents.
 */
export function unindent(strings, ...values) {
  const lines = String.raw(strings, values).split('\n');

  const minIndents = lines
    .filter(line => /\S/.test(line))
    .reduce((min, line) => {
      const indents = line.match(/^\s+/);
      const nIndents = indents !== null ? indents[0].length : 0;
      return Math.min(min, nIndents);
    }, Infinity);

  return lines
    .map(line => line.substring(minIndents))
    .join('\n');
}

