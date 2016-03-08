
/**
 * Create the definition of CLI options.
 */
export default function defineOptions() {
  return {
    prepend: 'Usage: depcop [options]',
    options: [
      ...basicOptions,
      ...checkOptions
    ]
  };
}

/**
 * Basic options.
 */
const basicOptions = [{
  heading: 'Basic'
}, {
  option: 'help',
  alias: 'h',
  type: 'Boolean',
  description: 'Show this usage'
}, {
  option: 'version',
  alias: 'v',
  type: 'Boolean',
  description: 'Output the version'
}, {
  option: 'depcoprc',
  type: 'Boolean',
  default: 'true',
  description: 'Disable use of configuration from .depcoprc'
}, {
  option: 'config',
  alias: 'c',
  type: 'String',
  description: 'Specify the .depcoprc path'
}, {
  option: 'lib-sources',
  alias: 'l',
  type: '[String]',
  description: 'Spefify patterns of library sources',
  concatRepeatedArrays: true
}, {
  option: 'dev-sources',
  alias: 'd',
  type: '[String]',
  description: 'Spefify patterns of development sources',
  concatRepeatedArrays: true
}, {
  option: 'format',
  alias: 'f',
  type: 'String',
  description: 'Specify the output format'
}];

/**
 * Check options.
 */
const checkOptions = [{
  heading: 'Checks'
}, {
  option: 'missing',
  type: 'Object',
  description: 'Check if there are missing dependencies'
}, {
  option: 'unused',
  type: 'Object',
  description: 'Check if there are unused dependencies'
}, {
  option: 'strayed',
  type: 'Object',
  description: 'Check if there are strayed dependencies'
}];
