
/**
 * Create the definition of CLI options.
 */
export default function defineOptions() {
  return {
    prepend: 'Usage: depcop [options]',
    append: 'Website: https://github.com/ryym/node-depcop',
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
  description: 'Disable use of configuration from .depcoprc.js'
}, {
  option: 'config',
  alias: 'c',
  type: 'String',
  description: 'Specify the path of .depcoprc.js'
}, {
  option: 'lib-sources',
  alias: 'l',
  type: '[String]',
  description: 'Spefify patterns of library source paths',
  concatRepeatedArrays: true
}, {
  option: 'dev-sources',
  alias: 'd',
  type: '[String]',
  description: 'Spefify patterns of development source paths',
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
  description: 'Warn if some used modules are not listed in package.json'
}, {
  option: 'unused',
  type: 'Object',
  description: 'Warn if some modules defined in package.json are not used'
}, {
  option: 'strayed',
  type: 'Object',
  description: 'Warn if some modules are used in wrong place'
}];
