
/**
 * Normalize the config object.
 * @param {Object} configObject - The config object.
 * @return {Object} The normalized config object.
 */
export default function normalizeConfig(configObject) {
  const defaultValues = getDefaultConfig();
  const object = Object.assign({}, configObject);

  Object.keys(defaultValues).forEach(key => {
    if (! object.hasOwnProperty(key)) {
      object[key] = defaultValues[key];
    }
  });
  return object;
}

/**
 * Create a default config object.
 * @private
 */
function getDefaultConfig() {
  return {
    checks: {
      missing: {},
      strayed: {},
      unused: {}
    },
    libSources: [],
    devSources: [],
    formatter: 'json'
  };
}
