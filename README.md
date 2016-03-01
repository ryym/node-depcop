# :construction: WIP :construction:

# Depcop - Validate dependencies in package.json

[![npm](https://img.shields.io/npm/v/node-depcop.svg)][npm-version]
[![Travis](https://img.shields.io/travis/ryym/node-depcop/master.svg)][travis-ci]
[![Appveyor](https://ci.appveyor.com/api/projects/status/geea51i0a86loy24/branch/master?svg=true)][appveyor]
[![Coveralls](https://img.shields.io/coveralls/ryym/node-depcop.svg)][coveralls]
[![David](https://img.shields.io/david/ryym/node-depcop.svg)][david]
[![David dev](https://img.shields.io/david/dev/ryym/node-depcop.svg)][david-dev]
[![License](http://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

[npm-version]: https://www.npmjs.org/package/node-depcop
[travis-ci]: https://travis-ci.org/ryym/node-depcop
[appveyor]: https://ci.appveyor.com/project/ryym/node-depcop/branch/master
[coveralls]: https://coveralls.io/github/ryym/node-depcop?branch=master
[david]: https://david-dm.org/ryym/node-depcop
[david-dev]: https://david-dm.org/ryym/node-depcop#info=devDependencies

Depcop validates your `dependencies` and `devDependencies` in package.json.
It checks source code and warns if some dependency definitions are missing,
unused, or listed in a wrong group.

## Validations

### Missing module search

Makes sure:

* all modules used in library code are listed in `dependencies`.
* all modules used in development code are listed in `devDependencies`.

### Unused module search

Makes sure:

* `dependencies` and `devDependencies` don't contain modules used in any source.

### Strayed module search

Makes sure:

* `dependencies` don't contain modules used only in development code.
* `devDependencies` don't contain modules used in library code.

#### Note: definition of terms

| term | description |
| ---- | ----------- |
| library code     | Ordinary source files usually put in `./lib`. |
| development code | Test files, config files and build scripts like `gulpfile.js`. |

## Features

* ES2015 style support
* CommonJS style support
* Configurable

## Why?

It is usually difficult to notice that some dependency definitions are missing (or unused)
in local environment where necessary dependencies have been installed. Especially, it is
so difficult to notice when you accidentally define a module in `devDependencies` which is
used in library code. In this case, all tests will pass in both of local and CI environment
where `devDependencies` will be installed.
And it is not until the module is installed to user environments where
`devDependencies` doesn't be installed that it causes an error for lack of dependencies.
The goal of this module is to prevent such a tragedy.
