module.exports = {
  libSources: [
    'lib/**/*.js'
  ],
  devSources: [
    'gulpfile/*.js',
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
