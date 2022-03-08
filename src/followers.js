const fs = require('fs');
const { getFileHelper, constants, utils} = require('../helpers/');

const {
  CONSTANTS: {
    OLD_FILE_INDEX,
    LAST_FILE_INDEX,
    DIR_FOLLOWERS_PATH,
    DIR_FOLLOWING_PATH,
    HISTORY_FOLLOWERS_PATH,
  } = {},
} = constants;

const { sortBy } = utils;

const oldFollowersFileName = getFileHelper.getFile(DIR_FOLLOWERS_PATH, OLD_FILE_INDEX).file;
const lastFollowersFileName = getFileHelper.getFile(DIR_FOLLOWERS_PATH, LAST_FILE_INDEX).file;
const lastFollowingFileName = getFileHelper.getFile(DIR_FOLLOWING_PATH, LAST_FILE_INDEX).file;

const oldFollowersList = require(`../lists/followers/${oldFollowersFileName}`);
const lastFollowersList = require(`../lists/followers/${lastFollowersFileName}`);
const lastFollowingList = require(`../lists/following/${lastFollowingFileName}`);

const lists = { oldFollowersList, lastFollowersList };

function getNewFollowers({ oldFollowersList, lastFollowersList }) {
  return lastFollowersList
    .filter(({ id }) => !oldFollowersList.find((user) => user.id === id))
}

function getUnfollowers({ oldFollowersList, lastFollowersList }) {
  return oldFollowersList
    .filter(({ id }) => !lastFollowersList.find((user) => user.id === id))
}

function getUnfollowersWeFollow(lastWeFollowList, lastUnfollowersList) {
  return lastWeFollowList
    .filter(({ username }) => lastUnfollowersList.includes(username));
}

function renamedChannel({ oldFollowersList, lastFollowersList }) {
  return lastFollowersList
    .filter(({ id, username }) => (
      oldFollowersList.find((user) => (user.id === id) && (user.username !== username)))
    )
    .map(({ id, username }) => {
      return {
        "old": oldFollowersList.find((user) => (user.id === id)).username,
        "current": username
      };
    });
};

function startFollowersStatistics() {

  const newFollowers = getNewFollowers(lists);
  const unfollowers = getUnfollowers(lists);
  const unfollowersWeFollow = getUnfollowersWeFollow(lastFollowingList, unfollowers);
  const renamed = renamedChannel(lists);

  console.log(newFollowers);

  console.log(`START COMPARING FOLLOWERS LISTS!
  - Old list ${oldFollowersFileName}
  - Last list ${lastFollowersFileName}
  `);

  //CMD + OPTION + L
  fs.writeFile(
    HISTORY_FOLLOWERS_PATH,
    JSON.stringify({
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
      }
    ),
    function (err) {
      if (err) return console.log(err);
    }
  );
}

module.exports.startFollowersStatistics = startFollowersStatistics;
