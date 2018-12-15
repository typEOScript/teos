const program = require('commander');
const spawn = require('cross-spawn');

program.parse(process.argv);
const cmdArgs = [
  'test/*.test.js'
];
process.env.PATH = `${process.cwd()}/node_modules/mocha/bin${process.platform === 'win32' ? ';' : ':'}${process.env.PATH}`;

const test = spawn.sync()