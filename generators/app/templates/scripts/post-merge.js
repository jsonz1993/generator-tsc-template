const { exec } = require('./utils')

const changedFilesOutput = exec(`git diff --name-only HEAD~1..HEAD`);
const changedFiles = changedFilesOutput.split('\n');

if (changedFiles.includes('package.json')) {
  exec('npm install');
}
