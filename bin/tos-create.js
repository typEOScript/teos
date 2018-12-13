const program = require('commander');
const downloadRepo = require('download-git-repo');
const fs = require('fs');
const inquirer = require('inquirer');
const {info, error, success} = require('../lib/log');

const TEMPALTE_REPO = 'typEOScript/tos-template';

program.parse(process.argv);

const questions = [
  {
    type: 'input',
    name: 'project',
    message: 'Your project name?'
  }
];

(async function () {
  try {
    let answers = await inquirer.prompt(questions);
    // console.log(answers)
    const {project} = answers;
    if (project === '') {
      return error('please specify project name');
    }
    fs.mkdirSync(project, 0o755);
    info('Downloading contract template...');
    await download(TEMPALTE_REPO, `./${project}`);
    success('Initialize project successfully! Enjoy your blockchain trip!')
  } catch (e) {
    error(e.message)
  }
})();

function download(url, dest) {
  return new Promise((resolve, reject) => {
    downloadRepo(url, dest, err => {
      if (err) {
        reject(err);
        return
      }
      resolve();
    })
  });
}