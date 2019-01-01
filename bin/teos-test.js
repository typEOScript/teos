const program = require('commander');
const spawn = require('cross-spawn');
const {info, error, errorNoSymbol, success, successNoSymbol} = require('../lib/log');
const EOSIO = require('../lib/eosio');
const blockchain = new EOSIO();

(async function () {
  // Start a local blockchain
  info('Staring a local eosio blockchain...');
  try {
    await blockchain.start();
  } catch (e) {
    return error("Failed to start local blockchain");
  }
  successNoSymbol('Local eosio blockchain is running.');

  program.parse(process.argv);
  process.env.PATH = `${process.cwd()}/node_modules/mocha/bin${process.platform === 'win32' ? ';' : ':'}${process.env.PATH}`;

  info('Start testing...');
  const cmdArgs = [
    'test/*.test.js'
  ];

  const test = spawn('mocha', cmdArgs, {cwd: process.cwd(), env: process.env, stdio: 'inherit'});

  test.on('error', err => {
    if (err.code === 'ENOENT') {
      errorNoSymbol(`Could not find any test files matching pattern: ${cmdArgs[0]}`);
    } else {
      errorNoSymbol(err)
    }
    blockchain.stop();
    process.exit();
  });

  test.stdout.on('data', data => {
    info(data.toString('utf8'));
  });

  test.stderr.on('data', data => {
    errorNoSymbol(data);
  });

  test.on('close', code => {
    if (code !== 0) {
      error(`test exited with error code ${code}`)
    } else {
      success('test completed')
    }
    blockchain.stop();
  });

})();