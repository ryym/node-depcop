# :construction: WIP :construction:

# Depcop - Validate your dependencies

Depcop provides a way to validate your `dependencies` and `devDependencies`.
The module checks if:

* all modules used in library code are listed as `dependencies`.
* all modules used in development code are listed as `devDependencies`.
* `dependencies` don't contain modules used nowhere.
* `dependencies` don't contain modules used only in development code.
* `devDependencies` don't contain modules used nowhere.
* `devDependencies` don't contain modules used in library code.

Note: 'library code' means ordinary source files usually put in `./lib`
and 'development code' means some build scripts or config files like
`gulpfile.js`, `webpack.config.js`, etc.

