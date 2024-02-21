const getFileHelper = require("../../helpers/getFileHelper");
const os = require("os");
const { exec } = require("child_process");

const { getFileName } = getFileHelper;

function findUser(list, id) {
  return list.find((user) => user.id === id);
}

function getFollowsList(dir, fileIndex) {
  return getFileName(dir, fileIndex);
}

function sortBy(list, property = "username") {
  return list.map((user) => user[property]).sort();
}

function getPath(path, fileName) {
  if (!fileName) return undefined;

  return require(`${path}${fileName}`);
}

function openFile(path) {
  const platform = os.platform();

  const osMap = {
    darwin: "open",
    win32: "start",
    linux: "xdg-open",
  };

  exec(`${osMap[platform]} "${path}" &`, (err, stdout, stderr) => {
    if (err) {
      console.log(`exec error: ${err}`);
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }
  });
}

module.exports = {
  findUser,
  getPath,
  getFollowsList,
  sortBy,
  openFile,
};
