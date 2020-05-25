const chalk = require('chalk');
const highlight = require('cli-highlight').highlight;
const { convertBytes } = require('../sizeUtils');

const defaultReporter = ({ totalSaved, perPackage }) => {
  console.log(highlight(JSON.stringify(perPackage, null, 2), { language: 'json' }));
  console.log(chalk.white.bold(`Total to be saved: ${convertBytes(totalSaved)}`));
};

module.exports = defaultReporter;
