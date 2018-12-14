const program = require('commander');
const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');
const {info, warn, success, error} = require('../lib/log');
const spawn = require('cross-spawn');

// locate contract source files
const contracts = glob.sync('contracts/*');
if (contracts.length === 0) {
  error('Cannot find any contract source files');
}

// create build dir
const buildDir = path.join(process.cwd(), 'build');
if (fs.existsSync(buildDir)) {
  fs.emptyDirSync(buildDir)
} else {
  fs.mkdir(buildDir)
}

program
  .option('-c,--contract <name>', 'contract name')
  .option('-a,--abi', 'generate abi file')
  .option('-w,--wasm', 'generate wasm file')
  .option('-t,--wast', 'generate wast file')
  .action(option => {
    // console.log(option)
    let targets = [], {contract} = option;
    if (contract) {
      console.log(contract);
      const contractPath = path.join(process.cwd(), 'contracts', contract, `${contract}.cpp`);
      if (!fs.existsSync(contractPath)) {
        return error(`Cannot find ${contract}.cpp in contracts dir`);
      }
      targets.push(contractPath)
    } else {
      targets = contracts
    }

    info("Begin to compile contracts...");
    for (let i in targets) {
      const name = path.parse(targets[i]).name;
      const cmdArgs = [targets[i]];
      if (option.wasm) {
        console.log('generate abi');
        cmdArgs.push('-b', `build/${name}.wasm`)
      }
      if (option.abi) {
        console.log('generate wasm');
        cmdArgs.push('-g', `build/${name}.abi`)
      }
      if (option.wast) {
        console.log('generate wast');
        cmdArgs.push('-t', `build/${name}.wast`)
      }

      // if no special option, use default build
      if (!option.abi && !option.wasm && !option.wast) {
        cmdArgs.push(
          '-b', `build/${name}.wasm`,
          '-g', `build/${name}.abi`,
          '-t', `build/${name}.wast`
        )
      }

      const rs = spawn.sync('asc', cmdArgs, {cwd: process.cwd(), stdio: 'inherit', env: process.env})
      console.log(rs);
      if (rs.stderr && rs.stderr.length > 0) {
        if (rs.stderr.indexOf('WARNING') !== -1) {
          warn(rs.stderr)
        } else {
          error(rs.stderr)
        }
        return
      }

      if (rs.error) {
        return error(rs.error)
      }
    }

    success("Compile successfully!")

  })
  .parse(process.argv);
