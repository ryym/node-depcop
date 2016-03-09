# Usage

To use Depcop, install Depcop by npm first.

```sh
npm install --save-dev depcop
```

## Command Line Interface

You can run validations via CLI.

```sh
Usage: depcop [option..]
```

Not: If you install Depcop locally, you have to execute it like:

```sh
# Run depcop in './node_modules'.
$(npm bin)/depcop --help
```

### -c, --config

Allows you to specify a path of `.depcoprc.js` explicitly
([about a configuration file][configuration file]).

```sh
depcop -c sub/.depcoprc.sub.js
```

### --no-depcoprc

Disables use of configuration from `.depcoprc.js` or `package.json`
([about a configuration file][configuration file]).

```sh
depcop --no-depcoprc
```

### -l, --lib-sources

Defines patterns of library source paths
([configuring library sources]).

```sh
depcop -l 'lib/*.js','lib/stable/*.js'
depcop -l 'lib/*.js' -l 'lib/stable/*.js'
```

### -d, --dev-sources

Defines patterns of development source paths
([configuring development sources]).

```sh
depcop -d 'test/*.js','webpack.config.js'
depcop -d 'test/*.js' -d 'webpack.config.js'
```

### -f, --format

Allows you to specify a format of validation results
([configuring format]).

```sh
depcop -f json
```

### --missing

Enables [missing module search]. You can also specify validator options
as values of the option ([configuring missing search]).

```sh
depcop --missing 'ignore:foo'
```

### --unused

Enables [unused module search]. You can also specify validator options
as values of the option ([configuring unused search]).

```sh
depcop --unused 'ignore:bar'
```

### --strayed

Enables [strayed module search].

```sh
depcop --strayed
```

### About option values

You can use [levn] format to specify option values like:


```sh
depcop --missing '{ignore: [foo, bar, baz]}'
```

All options are parsed by [optionator].

## Node.js API

You can also use Depcop as a Node.js module.

```js
// example.js

import { makeDepcop } from 'depcop';

const depcop = makeDepcop({
  noConfigLoading: true,
  options: {
    checks: {
      strayed: {}
    }
  }
});

const result = depcop.generateReport();

if (result.warningCount > 0) {
  const format = depcop.getFormatter();
  console.log(format(result));

  throw new Error('Depcop reported some problems');
}
```

### makeDepcop([settings])

Creates a Depcop instance to execute validations.
The `settings` argument is optional.

#### settings.options

The options for Depcop. Available fields are the same as [configuration file].

#### settings.cwd

The base directory Depcop searches a [configuration file] from.

#### settings.pkgPath

The path of a `package.json`. Its `dependencies` and `devDependencies` will be
used for validations.

#### settings.configPath

The path of a [configuration file].

#### settings.noConfigLoading

If true, Depcop doesn't load options from a [configuration file].
`settings.configPath` is ignored even if it is specified.

### Depcop instance

#### Depcop#generateReport()

Runs validations based on the specified configuration and generate a report object.

#### Depcop#getFormatter([name])

Returns a formatter of a result object. If the name is omitted, a default formatter
is returned
([available formats][configuring format]).



[configuration file]: ./configuration.md#configuration-file
[configuring library sources]: ./configuration.md#libSources
[configuring development sources]: ./configuration.md#devSources
[configuring format]: ./configuration.md#format
[configuring missing search]: ./configuration.md#checks.missing
[configuring unused search]: ./configuration.md#checks.unused
[configuring strayed search]: ./configuration.md#checks.strayed

[missing module search]: ./validations.md#missing-module-search
[unused module search]: ./validations.md#unused-module-search
[strayed module search]: ./validations.md#strayed-module-search

[optionator]: https://github.com/gkz/optionator
[levn]: https://github.com/gkz/levn
