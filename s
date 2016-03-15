#!/usr/bin/env node

/** eslint-disable */
/**
 * A script to make git comit messages more readable
 * on terminal by replacing emojis with simple words.
 * @example
 *     ./s log -5 --oneline
 */
'use strict';

/**
 * Emoji table
 */
var emojiNames = {
  sunny:    'feat ',  // A backwords-compatible feature or enhancement.
  zap:      'break',  // A backwords-incompatible feature or enhancement.
  lock:     'test ',  // Adding or correcting tests.
  bug:      'fix  ',  // A bug fix.
  sparkles: 'refac',  // A code change that neither fixes a bug nor adds a feature.
  memo:     'docs ',  // Changes to documentation.
  wrench:   'chore',  // Changes to build scripts, config files, package.json, etc.
  other:    '  -  ',
}

var spawn = require('child_process').spawn;
var commands = process.argv.slice(2);
var git = spawn('git', commands);

git.stdout.on('data', function(data) {
  var output = String(data)
    .split('\n')
    .map(function(line) {
      return line

        // Emphasise scopes.
        .replace(/\:\s([^: ]+):/, ': [$1]')

        // Strip emojis.
        .replace(/\s(?::[a-z]+:)+/, function(match) {
          var firstEmoji = match.split(':')[1];
          var word = emojiNames[firstEmoji] || emojiNames.other;
          return ' ' + word + ':';
        });
    })
    .join('\n');

  process.stdout.write(output);
});

git.stderr.on('data', function(data) {
  console.log(String(data));
});
