#!/usr/bin/env node
/* eslint-disable no-tabs */

const analyze = require('../src');
const chalk = require('chalk');
const options = require('yargs-parser')('--foo=99 --bar=33');

function helpText() {
  return `
		--help
		--path      where is the node modules you want to scan
	`;
}

function run() {
  if (options.help) {
    chalk.white(helpText());
  }

  const path = options.path;

  analyze(path);
}

run();
