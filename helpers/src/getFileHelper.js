const fs = require('fs');
const path = require('path');

const getFile = (dir, index) => {
  const files = orderRecentFiles(dir);
  return files.length ? files[index] : undefined;
};

const orderRecentFiles = (dir) => {
  return fs.readdirSync(dir)
    .filter(file => fs.lstatSync(path.join(dir, file)).isFile())
    .map(file => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
    .sort((a, b) => (b.mtime.getTime() - a.mtime.getTime()));
};


module.exports = {
  getFile,
  orderRecentFiles,
};
