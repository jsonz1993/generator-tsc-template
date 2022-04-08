const fs = require('fs');
const generateTSConfig = stagedFilenames => {
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  tsconfig.include = stagedFilenames;
  fs.writeFileSync("tsconfig.lint.json", JSON.stringify(tsconfig));
  return "tsc --noEmit --project tsconfig.lint.json";
};
module.exports = {
  "*": [
    "prettier --write --ignore-unknown"
  ],
  "*.{js,ts}": [
    "eslint --cache"
  ],
  "*.ts": [
    generateTSConfig,
  ],
}
