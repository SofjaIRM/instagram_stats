const fs = require('fs');
const { SYSTEM_FILES_LIST } = require('../helpers/constants');


const getFileName = (dir, index) => {
  const files = orderRecentFiles(dir);
  return files.length ? files[index] : undefined;
};

function isNotSystemFiles(filename) {
  const systemFilesRegex = new RegExp(SYSTEM_FILES_LIST.join('|'));
  return !systemFilesRegex.test(filename);
}

function orderRecentFiles(dir) {
  return fs.readdirSync(dir)
    .filter(isNotSystemFiles)
    .sort((a, b) => {
      return b - a;
    });
};

module.exports = {
  getFileName,
};
