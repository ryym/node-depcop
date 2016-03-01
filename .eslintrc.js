var a;
module.exports = {
  "root": true,
  "parser": "babel-eslint",
  "extends": "eslint:recommended",
  "env": {
    "node": true,
    "es6": true
  },
  "rules": {
    // Best Practicies
    "curly": 2,
    "dot-notation": 2,
    "no-caller": 2,
    "no-catch-shadow": 2,
    "no-class-assign": 2,
    "no-empty-function": 2,
    "no-eval": 2,
    "no-extend-native": 2,
    "no-extra-bind": 2,
    "no-extra-label": 2,
    "no-implicit-coercion": 2,
    "no-implicit-globals": 2,
    "no-invalid-this": 2,
    "no-iterator": 2,
    "no-labels": 2,
    "no-lone-blocks": 2,
    "no-loop-func": 2,
    "no-multi-spaces": 2,
    "no-multi-str": 2,
    "no-native-reassign": 2,
    "no-new": 2,
    "no-new-wrappers": 2,
    "no-proto": 2,
    "no-return-assign": 2,
    "no-self-compare": 2,
    "no-sequences": 2,
    "no-shadow-restricted-names": 2,
    "no-throw-literal": 2,
    "no-trailing-spaces": 2,
    "no-unused-expressions": [2, {
      "allowShortCircuit": true,
      "allowTernary": true
    }],
    "no-useless-call": 2,
    "no-useless-concat": 2,
    "no-useless-constructor": 2,
    "no-var": 2,
    "no-void": 2,
    "no-warning-comments": 1,
    "no-whitespace-before-property": 2,
    "no-with": 2,
    "prefer-arrow-callback": 2,
    "prefer-const": 2,
    "prefer-rest-params": 1,
    "prefer-spread": 1,
    "radix": 2,
    "require-yield": 2,
    "wrap-iife": 2,
    "yoda": [2, "never"],

    // Stylistic Issues
    "arrow-spacing": 2,
    "block-spacing": 2,
    "brace-style": [2, "stroustrup"],
    "camelcase": 2,
    "comma-spacing": [2, {
      "before": false,
      "after": true
    }],
    "comma-style": [2, "last"],
    "computed-property-spacing": [2, "never"],
    "eol-last": 2,
    "func-style": [2, "declaration", {
      "allowArrowFunctions": true
    }],
    "id-blacklist": [2, "e"],
    "indent": [2, 2],
    "key-spacing": [2, {
      "beforeColon": false,
      "afterColon": true
    }],
    "keyword-spacing": 2,
    "linebreak-style": [2, "unix"],
    "lines-around-comment": [2, {
      "beforeBlockComment": true,
      "beforeLineComment": true
    }],
    "max-depth": [2, 4],
    "max-len": [2, 80, 4],
    "max-nested-callbacks": [2, 4],
    "max-params": [2, 5],
    "max-statements": [1, 20],
    "new-cap": 2,
    "new-parens": 2,
    "no-array-constructor": 2,
    "no-lonely-if": 2,
    "no-new-object": 2,
    "no-spaced-func": 2,
    "object-curly-spacing": [2, "always"],
    "one-var-declaration-per-line": 2,
    "operator-linebreak": [2, "before"],
    "quotes": [2, "single"],
    "semi": 2,
    "space-before-blocks": [2, "always"],
    "spaced-comment": [2, "always"],

    // Node.js and CommonJS
    "no-new-require": 2,
    "no-path-concat": 2,
    "no-process-exit": 2
  }
};
