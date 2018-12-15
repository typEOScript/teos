const spawn = require('cross-spawn');
const path = require('path');
const fs = require('fs-extra');
const {warnNoSymbol} = require('../lib/log');
const {asyncSleep} = require('../lib/utils');

/**
 * EOSIO starts a local eosio blockchian and interact with it using eosjs.
 *
 * @class
 */
module.exports = class EOSIO {
  async start() {
    const datadir = path.join(process.cwd(), '.eosio');
    if (fs.existsSync(datadir)) {
      try {
        fs.emptyDirSync(datadir);
      } catch (e) {
        // TODO: figure out why unlink shared_momery.bin sometimes failed.
        if (e.syscall === 'unlink' && e.path.indexOf('shared_memory.bin') !== -1) {
          // warnNoSymbol(`Warning: ${e.code}: ${e.syscall} ${e.path}`);
          await asyncSleep(2000);
          return this.start();
        }
      }
    }

    this.nodeos = spawn('nodeos', [
      '-e', '-p', 'eosio',
      '--plugin', 'eosio::producer_plugin',
      '--plugin', 'eosio::chain_api_plugin',
      '--plugin', 'eosio::http_plugin',
      '-d', `${datadir}/data`,
      `--config-dir`, `${datadir}/config`,
      '--access-control-allow-origin=\'*\'',
      '--contracts-console',
      '--http-validate-host=false',
      '-filter-on=\'*\''
    ]);

    // this.nodeos.stderr.on('data', data => {
    //   info(data.toString('utf8'))
    // });

    this.nodeos.on('close', code => {
      if (code !== 0) {
        throw new Error('Failed to start local chain')
      }
    });

    // wait 2 seconds to make the blockchain starting complete
    await asyncSleep(2000)
  }

  stop() {
    this.nodeos.kill();
  }
};