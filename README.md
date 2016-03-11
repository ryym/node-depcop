# Depcop - Validate dependencies in package.json

[![npm](https://img.shields.io/npm/v/node-depcop.svg)][npm-version]
[![Travis](https://img.shields.io/travis/ryym/node-depcop/master.svg)][travis-ci]
[![Appveyor](https://ci.appveyor.com/api/projects/status/geea51i0a86loy24/branch/master?svg=true)][appveyor]
[![Coveralls](https://img.shields.io/coveralls/ryym/node-depcop.svg)][coveralls]
[![David](https://img.shields.io/david/ryym/node-depcop.svg)][david]
[![David dev](https://img.shields.io/david/dev/ryym/node-depcop.svg)][david-dev]
[![License](http://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

[![docs](http://img.shields.io/badge/to-docs-blue.svg)](/docs)

[npm-version]: https://www.npmjs.org/package/node-depcop
[travis-ci]: https://travis-ci.org/ryym/node-depcop
[appveyor]: https://ci.appveyor.com/project/ryym/node-depcop/branch/master
[coveralls]: https://coveralls.io/github/ryym/node-depcop?branch=master
[david]: https://david-dm.org/ryym/node-depcop
[david-dev]: https://david-dm.org/ryym/node-depcop#info=devDependencies

Depcop is a tool to validate your `dependencies` and `devDependencies` in a `package.json`.
It checks your source code and warns if some dependency definitions are missing,
unused, or listed in a wrong group.

## Features

* ES2015 style support (`import` declarations)
* CommonJS style support (`require` expressions)
* Configurable

## Validations

### [Missing module check]

Makes sure:

* all modules used in source code are listed in `dependencies` or `devDependencies`

### [Unused module check]

Makes sure:

* `dependencies` and `devDependencies` don't contain modules used in any source

### [Strayed module check]

Makes sure:

* `dependencies` don't contain modules used only in development code
* `devDependencies` don't contain modules used in library code

#### Note: definition of terms

| term | description |
| ---- | ----------- |
| library code     | Ordinary source files usually put in `./lib`. |
| development code | Test files, config files, or build scripts like `gulpfile.js`. |

For more details about validations, please see [Validations].

## Installation

You can install Depcop using npm.

```
npm install --save-dev depcop
```

## Usage

You can use Depcop via [CLI] or [Node.js API].
Please see [Usage] for details.

```sh
# CLI
depcop --missing -l 'lib/**/*.js' -d 'test/**/*.js','gulpfile.js'
```

```js
// JS
import { makeDepcop } from 'depcop';

const depcop = makeDepcop({
  options: {
    libSources: ['lib/**/*.js'],
    devSources: ['test/**/*-test.js'],
    checks: {
      unused: {
        ignore: ['istanbul', 'mocha']
      }
    }
  }
});

const result = depcop.runValidations();

// ..
```

## Configuration

You can write a configuration file to configure Depcop.
Please see [Configuring Depcop] for details.

```js
// .depcoprc.js
module.exports = {
  libSources: [
    'lib/**/*.js'
  ],
  devSources: [
    'test/**/*-test.js',
    'gulpfile.babel.js'
  ],
  checks: {
    missing: {
      ignore: [/alias.+/]
    }
  }
};
```

## Why?

It is usually difficult to notice that some dependency definitions are missing (or unused)
in local environment where necessary dependencies have been installed. Especially, it is
so difficult to notice when you accidentally define a module in `devDependencies` which is
actually used in library code. In this case, all tests will pass in both of local and CI environment
where `devDependencies` will be installed.
And it is not until the module is installed to user environments where
`devDependencies` doesn't be installed that it causes an error for lack of dependencies.
The goal of this module is to prevent such a tragedy.

## Similar projects

* [dependency-check] - A CLI tool to check missing or unused dependencies.
* [require-lint] - A CLI tool which also supports [CoffeeScript].

[Missing module check]: /docs/validations.md#missing-module-check
[Unused module check]: /docs/validations.md#unused-module-check
[Strayed module check]: /docs/validations.md#strayed-module-check

[Validations]: /docs/validations.md
[Usage]: /docs/usage.md
[CLI]: /docs/usage.md#command-line-interface
[Node.js API]: /docs/usage.md#nodejs-api
[Configuring Depcop]: /docs/configuration.md

[dependency-check]: https://github.com/maxogden/dependency-check
[require-lint]: https://github.com/TabDigital/require-lint
[CoffeeScript]: http://coffeescript.org/
