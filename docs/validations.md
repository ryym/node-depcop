# Depcop Validations

[![home][bg-home]](/REMADE.md)
[![valdiations][bg-validations]](/docs/validations.md)
[![configuration][bg-configuration]](/docs/configuration.md)
[![usage][bg-usage]](/docs/usage.md)

[bg-home]: https://img.shields.io/badge/to-home-blue.svg?style=flat-square
[bg-validations]: https://img.shields.io/badge/to-validations-brightgreen.svg?style=flat-square
[bg-configuration]: https://img.shields.io/badge/to-configuration-green.svg?style=flat-square
[bg-usage]: https://img.shields.io/badge/to-usage-yellowgreen.svg?style=flat-square


Depcop provides several ways to validate `dependencies` and `devDependencies`.

## Missing module check

This validation warns if there are one or more _missing modules_.
It is a module which is used somewhere but not listed in
`dependencies` nor `devDependencies`.

### Example

In the following example, `react-router` will be warned because
it is used in the source code without a definition of `dependencies`.

package.json

```json
{
  "name": "project-name",
  "dependencies": {
    "react": "1.0.0",
    "react-dom": "1.0.0"
  }
}
```

source code

```js
// lib/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import Router, { Route } from 'react-router';  // ERROR: Not listed in `dependencies`.
import App from './components/App';

// routing definitions...
```

## Unused module check

This validation warns if there are one or more _unsued modules_.
It is a module which is listed in `dependencies` or `devDependencies`
but used in nowhere.

### Example

In the following example, `chai` will be warned because
it is never used in the source code.

package.json

```json
{
  "name": "project-name",
  "devDependencies": {
    "chai": "1.x.x  // ERROR: Never used.",
    "mocha": "1.0.0",
    "power-assert": "1.0.0",
    "sinon": "1.0.0"
  }
}
```

source code

```js
// test/someModule.js

const assert = require('power-assert');
const sinon = require('sinon');
const someModule = require('../lib/someModule');

describe('someModule', () => {
  // test cases...
});
```

## Strayed module check

This validation warns if there are one or more _strayed modules_.
It is a module which is used in a wrong place. There are two patterns of a strayed module:

* A module defined in `dependencies` but used only in development code
* A module defined in `devDependencies` but used in library code

### Example

In the following example, `glob` and `lodash.flatmap` will be warned because
`glob` is used only in development code and `lodash.flatmap` is used in
library code despite of their definitions.

package.json

```json
{
  "name": "project-name",
  "dependencies": {
    "glob": "1.x.x",
    "optionator": "1.0.0"
  },
  "devDependencies": {
    "gulp": "1.0.0",
    "gulp-babel": "1.0.0",
    "lodash.flatmap": "1.x.x"
  }
}
```

source code (library)

```js
// lib/cli.js

import optionator from 'optionator';
import flatmap from 'lodash.flatmap';  // ERROR: Defined in `devDependencies`.
import helper from './helper';

// ...
```

source code (development)

```js
// gulpfile.js

var gulp = require('gulp');
var babel = require('gulp-babel');
var flatmap = require('lodash.flatmap');
var glob = require('glob');  // ERROR: Defined in `dependencies`.

// gulp tasks...
```

## How it works

Depcop traverses your source code and collects information about imported modules
to compare them with definitions of `dependencies` and `devDependencies` in a `package.json`.
Note that dynamic `require`s like `require('module' + 'name');` are ignored because
the code analyzing is done statically.
And of course, relative paths and builtin modules are also ignored.
Here is an example of ignored module imports.

```js
// Dynamic requires
var name = 'module1';
var module1 = require(name);
var load = require;
var module2 = load('module2');

// Relative paths
import file1 from './path/to/the/file';
import file2 from '../../parent';

// Builtin modules
import path from 'path';
import fs from 'fs';
```
