const program = require('commander');

program
  .option('-c,--contract <name>', 'contract name')
  .option('-a,--abi', 'only generate abi file')
  .option('-w,--wasm', 'only generate wasm file')
  .action(option => {
    // console.log(option)
    if (option.contract) {
      console.log(option.contract)
    }
    if (!option.abi && !option.wasm) {
      console.log('generate both abi and wasm')
    } else {
      if (option.abi) {
        console.log('only generate abi')
      }
      if (option.wasm) {
        console.log('only generate wasm')
      }
    }
  })
  .parse(process.argv);