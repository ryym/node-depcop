module.exports = {
  libSources: [
    'bin/depcop',
    'lib/**/*.js'
  ],
  devSources: [
    'gulpfiles/**/*.js',
    'test/**/*.spec.js',
    'test/**/helper.js'
  ],
  checks: {
    missing: {
      ignore: [
        /\$lib/
      ]
    },
    unused: {
      ignore: [
        /babel-.+/,
        /coveralls/,
        /nyc/
      ]
    },
    strayed: {}
  }
}
