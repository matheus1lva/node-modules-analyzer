#!/usr/bin/env node
/* eslint-disable no-tabs */

const { analyze, defaultReporter } = require('@node-modules-analyzer/core');
const chalk = require('chalk');
const options = require('yargs-parser')(process.argv.slice(2));

function helpText() {
  return `
		--help
		--path      where is the node modules you want to scan
	`;
}

function run() {
  if (options.help) {
    chalk.white(helpText());
  } else {
    const path = options.path;
    const results = analyze(path);
    if(!Object.keys(results.perPackage).length) {
      process.exit(0);
    }
    defaultReporter(results);
    process.exit(1);
  }
}

run();
