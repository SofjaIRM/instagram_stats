const fs = require('fs');
const path = require('path');
const constants = require('../helpers/constants');
const { findUser, getFollowsList, sortBy } = require('../common');
const { exec } = require('child_process');

const {
    PREVIEWS_FILE_INDEX,
    CURRENT_FILE_INDEX,
    FOLLOWING_PATH,
    HISTORY_FOLLOWING_PATH,
} = constants;

const previousFollowingFileName = getFollowsList(FOLLOWING_PATH, PREVIEWS_FILE_INDEX); //?
const currentFollowingFileName = getFollowsList(FOLLOWING_PATH, CURRENT_FILE_INDEX); //?

const previousFollowingList = require(`../lists/following/${previousFollowingFileName}`);
const currentFollowingList = require(`../lists/following/${currentFollowingFileName}`);

const followingLists = { previousFollowingList, currentFollowingList };

function getNewUsersWeFollow({ previousFollowingList, currentFollowingList }) {
  return currentFollowingList.filter(({ id }) => !findUser(previousFollowingList, id));
}

function getUsersStartingFollowingUs({ previousFollowingList, currentFollowingList }) {
  return currentFollowingList.filter(({ id }) => findUser(previousFollowingList, id));
}

function getUsersStartingFollowingBack(lists) {
  return getUsersStartingFollowingUs(lists)
    .filter(({followed_by_viewer, follows_viewer}) => (
      followed_by_viewer && follows_viewer
    ))
}

function getUsersNotFollowingBack(list) {
  return list.filter(({ follows_viewer }) => !follows_viewer);
}


async function startFollowingStatistics() {
  const newUsersWeFollow = getNewUsersWeFollow(followingLists);
  const startedFollowingUs = getUsersStartingFollowingUs(followingLists);

  // Users we follow but are not following back
  const usersNotFollowingUsBack = getUsersNotFollowingBack(currentFollowingList)

  // Users that started following back after we follow them
  const usersStartingFollwingBack = getUsersStartingFollowingBack(followingLists);

  const filePath = path.join(__dirname, HISTORY_FOLLOWING_PATH);

  console.log(`
  START COMPARING FOLLOWING LISTS!
    - Old list ${previousFollowingFileName}
    - Last list ${currentFollowingFileName}

  File saved on : ${filePath}
  `);

  await fs.promises.writeFile(filePath, JSON.stringify(
    {
      "NEW_PAGES_WE_FOLLOW": {
        length: newUsersWeFollow.length,
        follow: sortBy(newUsersWeFollow)
      },
      "FOLLOWED_BACK": {
        length: usersStartingFollwingBack.length,
        array: sortBy(usersStartingFollwingBack)
      },
      "NOT_FOLLOW_BACK": {
        length: usersNotFollowingUsBack.length,
        array: sortBy(usersNotFollowingUsBack)
      },
      "STARTED_FOLLOWING_US": {
        length: startedFollowingUs.length,
        array: sortBy(startedFollowingUs) },
    }, null, 2));

  exec(`"/Applications/WebStorm.app/Contents/MacOS/webstorm" "${filePath}" &`,
    (err, stdout, stderr) => {
      if (err) console.log(`exec error: ${err}`);
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
   });
}

module.exports = {
  getNewUsersWeFollow,
  getUsersStartingFollowingBack,
  getUsersNotFollowingBack,
  startFollowingStatistics
};
