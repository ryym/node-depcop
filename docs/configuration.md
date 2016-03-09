# Configuring Depcop

## Configuration file

Depcop has several options to controll its validations.
To configure Depcop, You can use a configuration file.
Currently, there are two ways to define options:

* put a JS file named `.depcoprc.js` in the root directory of your project.
* add a `depcop` filed in a `package.json`.

The configuration object would look like:

```js
module.exports = {

  libSources: [
    'lib/**/*.js'
  ],

  devSources: [
    'gulpfile.babel.js',
    'test/**/*.js'
  ],

  checks: {
    missing: {},
    unused: {
      ignore: [/babel-.+/]
    },
    strayed: {}
  },

  format: 'simple'
};
```

## Basic options

### libSources

type: `String[]`

The `libSources` option defines patterns of library source paths where
modules listed in `dependencies` should be used in.

e.g. `'lib/**/*.js'`, `src/**/*.js`

### devSources

type:`String[]`

The `devSources` option defines patterns of development source paths where
modules listed in `devDependencies` should be used in.

e.g. `test/**/*.js`, `gulpfile.js`

### Format

type: `String`

The `format` option defines a format of validation results.
Available formats are:

* `simple` (default)
* `json`

## Validator options

You can list validations you want to run using the `checks` option.
Values of its fields must be an object.

```js
checks: {
  missing: {},  // Good
  unused: true  // Bad
}
```

### checks.missing

type: `Object`

Enables [missing module search].

#### Options for missing module search

##### ignore

type: `(String | RegExp)[]`

The patterns of module names to be ignored. For example, when you use aliases to import some modules
(e.g. by [webpack] or [babel-plugin-module-alias]), they should be ignored by this option.

```js
missing: { ignore: ['alias-pattern'] }
```

### checks.unused

type: `Object`

Enables [unused module search].

#### Options for unused module search

##### ignore

type: `(String | RegExp)[]`

The patterns of module names to be ignored.
Some dev-dependency modules that don't be imported in source code directly should be ignored
by this option (e.g. [Babel] presets, [ESLint] plugins, or [coveralls]).

```js
unused: { ignore: ['babel-.+'] }
```

### checks.strayed

type: `Object`

Enables [strayed module search].

[missing module search]: ./validations.md#missing-module-search
[unused module search]: ./validations.md#unused-module-search
[strayed module search]: ./validations.md#strayed-module-search

[webpack]: https://webpack.github.io/
[Babel]: https://babeljs.io/
[babel-plugin-module-alias]: https://github.com/tleunen/babel-plugin-module-alias
[ESLint]: http://eslint.org/
[coveralls]: https://github.com/nickmerwin/node-coveralls
