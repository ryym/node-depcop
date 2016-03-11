#!/usr/bin/env node

/** eslint-disable */
/**
 * A script to make git comit messages more readable
 * on terminal by replacing emojis with simple words.
 * @example
 *     ./s log -5 --oneline
 */
'use strict';

var spawn = require('child_process').spawn;
var commands = process.argv.slice(2);
var git = spawn('git', commands);

git.stdout.on('data', data => {
  var output = String(data)
    .replace(/:sunny:/g    , 'feat :')
    .replace(/:zap:/g      , 'break:')
    .replace(/:lock:/g     , 'test :')
    .replace(/:bug:/g      , 'fix  :')
    .replace(/:sparkles:/g , 'refac:')
    .replace(/:memo:/g     , 'docs :')
    .replace(/:wrench:/g   , 'chore:')
    .replace(/:[a-z]+:/g   , '  -  :')
    .replace(/:\s([^: ]+):/g, ':[$1]');

  process.stdout.write(output);
});

git.stderr.on('data', data => {
  console.log(String(data));
});
