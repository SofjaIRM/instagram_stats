const getFileHelper = require('../../helpers/getFileHelper');
const constants = require('../../helpers/constants')
const { join } = require('path');

const normalizePath = (path) =>  join(__dirname, path);

const { getFileName } = getFileHelper;

function findUser(list, id) {
  return list.find((user) => user.id === id);
}

function getFollowsList(dir, fileIndex) {
  const path = normalizePath(dir);
  const fileName = getFileName(path, fileIndex);
  return `${dir}${fileName}`;
}

function sortBy(list, property = 'username') {
  return list.map(( user ) => user[property]).sort();
}


module.exports = {
  findUser,
  getFollowsList,
  sortBy
}
