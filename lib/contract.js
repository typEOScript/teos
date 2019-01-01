const fs = require('fs-extra');
const path = require('path');
const Eos = require('eosjs');

/**
 * Contract creates a wrapper of .ts smart contract, and interact with the blockchain.
 *
 * @class
 */
class Contract {
  constructor(name) {
    const configPath = path.join(process.cwd(), 'teos.config.js');
    if (!fs.existsSync(configPath)) {
      throw new Error('No config file teos.config.js');
    }
    const config = require(configPath);
    if (config.keyProvider.length === 0) {
      throw new Error('No private keys found in keyProvider of teos.config.js')
    }
    const keyProvider = config.keyProvider;
    const network = config.networks[config.defaultNetwork];
    const eos = Eos({
      chainId: network.chainId || null,
      keyProvider,
      httpEndpoint: network.httpEndpoint,
      keyPrefix: network.keyPrefix,
      expireInSeconds: network.timeout || 60
    });

    this.config = config;
    this.eos = eos;
    this.name = name;
  }

  /**
   * Initialize will start a local chain, deploy contract binary, and register actions to `this`.
   *
   * @returns {Promise<void>}
   * @constructor
   */
  async Initialize() {
    const wasmPath = path.join(process.cwd(), `contracts/${name}/${name}.wasm`);
    const abiPath = path.join(process.cwd(), `contracts/${name}/${name}.abi`);
    if (!fs.existsSync(wasmPath)) {
      throw new Error(`No wasm file found in contracts/${name}`);
    }
    if (!fs.existsSync(abiPath)) {
      throw new Error(`No abi file found in contracts/${name}`);
    }
    // deploy contract
    const wasm = fs.readFileSync(wasmPath);
    const abi = JSON.parse(fs.readFileSync(abiPath));
    const account = this.config.deploy[this.name][this.config.defaultNetwork];
    await Promise.all([this.eos.setcode(account, 0, 0, wasm), this.eos.setabi(account, abi)]);

    // register actions interface
    for (let action of abi.actions) {
      this[action.name] = async (...args) => {
        this.__pushAction(this.name, args)
      }
    }
  }

  /**
   * Inner action invoke function.
   *
   * @param action - action name
   * @param args - arguments array for this action
   * @returns {Promise<void>}
   * @private
   */
  async __pushAction(action, args) {
    await this.eos.contract(this.name, contract => {
      contract[action](...args)
    })
  }
}

/**
 * Construct a contract with name and deploy it.
 *
 * @param name
 * @returns {Promise<void>}
 * @constructor
 */
async function MakeContract(name) {
  const contract = new Contract(name);
  await contract.Initialize();
}

module.exports = {
  Contract,
  MakeContract
};