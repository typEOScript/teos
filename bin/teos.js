const program = require('commander');
const pkg = require('../package');

program.version(pkg.version, '-v,--version');

program
  .command('create', 'Initialize a teos project.');

program
  .command('build', 'Compile ts contracts to wasm and abi files');

program
  .command('deploy', 'Deploy wasm and abi files to EOSIO blockchain');

program.parse(process.argv);

if (program.args.length === 0) {
  program.help();
}