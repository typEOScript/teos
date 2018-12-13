const chalk = require('chalk');

const info = console.log;
const warn = msg => console.log(chalk.yellow(msg));
const error = msg => console.log(chalk.red(msg));
const success = msg => console.log(chalk.green(msg));

module.exports = {
  info,
  warn,
  error,
  success
};