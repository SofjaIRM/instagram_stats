const getFileHelper = require('../../helpers/getFileHelper');

const { getFileName } = getFileHelper;

function findUser(list, id) {
  return list.find((user) => user.id === id);
}

function getFollowsList(dir, fileIndex) {
  return getFileName(dir, fileIndex);
}

function sortBy(list, property = 'username') {
  return list.map(( user ) => user[property]).sort();
}

function getPath(path, fileName) {
  if (!fileName) return undefined;

  return require(`${path}${fileName}`);
}



module.exports = {
  findUser,
  getPath,
  getFollowsList,
  sortBy
}
