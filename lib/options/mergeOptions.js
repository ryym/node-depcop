import isObject from 'lodash.isplainobject';

/**
 * Merge two options.
 * @param {Object} options
 * @param {Object} other
 * @return {Object} The new merged options.
 */
export default function mergeOptions(options, other) {
  return mergeAll({}, options, other);
}

/**
 * Merge all the given objects into the first one.
 * @private
 */
function mergeAll(...objects) {
  return objects.filter(isObject).reduce(mergeDeeply);
}

/**
 * Merge two objects deeply.
 * @private
 */
function mergeDeeply(left, right) {
  const isArray = Array.isArray.bind(Array);

  Object.keys(right).forEach(key => {
    const leftValue = left[key];
    const rightValue = right[key];

    if (isObject(rightValue) && isObject(leftValue)) {
      mergeDeeply(leftValue, rightValue);
    }
    else if (isArray(leftValue) && isArray(rightValue)) {
      left[key] = leftValue.concat(rightValue);
    }
    else {
      left[key] = right[key];
    }
  });

  return left;
}
