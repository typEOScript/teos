const chalk = require('chalk');
const symbols = require('log-symbols');

const info = msg => console.log(symbols.info, chalk.blue(msg));
const warn = msg => console.log(symbols.warning, chalk.yellow(msg));
const error = msg => console.log(symbols.error, chalk.red(msg));
const success = msg => console.log(symbols.success, chalk.green(msg));

module.exports = {
  info,
  warn,
  error,
  success
};