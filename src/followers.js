const fs = require('fs');
const constants = require('../helpers/constants');
const { findUser, getFollowsList, sortBy, getPath } = require('../common');
const { exec } = require('child_process');

const {
    PREVIEWS_FILE_INDEX,
    CURRENT_FILE_INDEX,
    FOLLOWERS_PATH,
    FOLLOWING_PATH,
    HISTORY_FOLLOWERS_PATH,
} = constants;

const previousFollowersFileName = getFollowsList(FOLLOWERS_PATH, PREVIEWS_FILE_INDEX);
const currentFollowersFileName = getFollowsList(FOLLOWERS_PATH, CURRENT_FILE_INDEX);
const currentFollowingFileName = getFollowsList(FOLLOWING_PATH, CURRENT_FILE_INDEX);

const previousFollowersList = getPath(FOLLOWERS_PATH, previousFollowersFileName);
const currentFollowersList = getPath(FOLLOWERS_PATH, currentFollowersFileName);
const currentFollowingList = getPath(FOLLOWING_PATH, currentFollowingFileName);

const followersLists = { previousFollowersList, currentFollowersList };

function getNewFollowers({previousFollowersList, currentFollowersList}) {
  return currentFollowersList.filter(({ id }) => !findUser(previousFollowersList, id));
}

function getUnfollowers({previousFollowersList, currentFollowersList}) {
  return previousFollowersList.filter(({ id }) => !findUser(currentFollowersList, id))
}

function getUnfollowersWeFollow(lastWeFollowList, currentUnfollowersList) {
  return currentUnfollowersList.filter(({ id }) => findUser(lastWeFollowList, id));
}

function getRenamedChannel({previousFollowersList, currentFollowersList}) {
  return currentFollowersList
    .filter(({id, username}) => (
      previousFollowersList
        .find((user) => (user.id === id) && (user.username !== username))))
    .map(({id, username}) => {
      return {
        "old": previousFollowersList.find((user) => (user.id === id)).username,
        "current": username
      };
    });
}

async function startFollowersStatistics() {
  const newFollowers = getNewFollowers(followersLists);
  const unfollowers = getUnfollowers(followersLists);
  const unfollowersWeFollow = getUnfollowersWeFollow(currentFollowingList, unfollowers);
  const renamed = getRenamedChannel(followersLists);

  console.log(`
  START COMPARING FOLLOWERS LISTS!
    - Old list ${previousFollowersFileName}
    - Last list ${currentFollowersFileName}
  
  File saved on: ${HISTORY_FOLLOWERS_PATH}
  `);

  await fs.promises.writeFile(HISTORY_FOLLOWERS_PATH, JSON.stringify(
    {
      "NEW_FOLLOWERS": {
        length: newFollowers.length,
        array: sortBy(newFollowers)
      },
      "UNFOLLOWED_US": {
        length: unfollowers.length,
        array: sortBy(unfollowers)
      },
      "UNFOLLOWED_US_AND_WE_FOLLOW": {
        length: unfollowersWeFollow.length,
        array: sortBy(unfollowersWeFollow)
      },
      "RENAMED_CHANNEL": {
        length: renamed.length,
        array: renamed
      },
    }, null, 2));

  exec(`"/Applications/WebStorm.app/Contents/MacOS/webstorm" "${HISTORY_FOLLOWERS_PATH}" &`,
    (err, stdout, stderr) => {
      if (err) console.log(`exec error: ${err}`);
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
  });
}

module.exports = {
  getRenamedChannel,
  getNewFollowers,
  getUnfollowers,
  getUnfollowersWeFollow,
  startFollowersStatistics
};
