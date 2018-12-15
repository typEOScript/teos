const chalk = require('chalk');
const symbols = require('log-symbols');

const info = console.log;
const warn = msg => console.log(symbols.warning, chalk.yellow(msg));
const error = msg => console.log(symbols.error, chalk.red(msg));
const success = msg => console.log(symbols.success, chalk.green(msg));

const warnNoSymbol = msg => console.log(chalk.yellow(msg));
const errorNoSymbol = msg => console.log(chalk.red(msg));
const successNoSymbol = msg => console.log(chalk.green(msg));

module.exports = {
  info,
  warn,
  error,
  success,
  warnNoSymbol,
  errorNoSymbol,
  successNoSymbol
};