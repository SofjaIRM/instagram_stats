const fs = require("fs");
const { SYSTEM_FILES_LIST } = require("../helpers/constants");

function toValidDate(file) {
  return Number(file.replace(".js", ""));
}

function getFileName(dir, index) {
  const files = sortByRecentFiles(dir);
  return files.length ? files[index] : undefined;
}

function isNotSystemFiles(filename) {
  const systemFilesRegex = new RegExp(SYSTEM_FILES_LIST.join("|"));
  return !systemFilesRegex.test(filename);
}

function sortByRecentFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter(isNotSystemFiles)
    .sort((a, b) => {
      return toValidDate(b) - toValidDate(a);
    });
}

module.exports = {
  getFileName,
  toValidDate,
};
