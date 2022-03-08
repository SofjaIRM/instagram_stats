const fs = require('fs');
const { getFileHelper, constants, utils } = require('../helpers');

const {
  CONSTANTS: {
    OLD_FILE_INDEX,
    LAST_FILE_INDEX,
    DIR_FOLLOWING_PATH,
    HISTORY_FOLLOWING_PATH,
  } = {},
} = constants;

const { sortBy } = utils;

const oldFollowingFileName = getFileHelper.getFile(DIR_FOLLOWING_PATH, OLD_FILE_INDEX).file;
const lastFollowingFileName = getFileHelper.getFile(DIR_FOLLOWING_PATH, LAST_FILE_INDEX).file;

const oldFollowingList = require(`../lists/following/${oldFollowingFileName}`);
const lastFollowingList = require(`../lists/following/${lastFollowingFileName}`);

const followingLists = { oldFollowingList, lastFollowingList };

function getNewFollowing({ oldFollowingList, lastFollowingList }) {
  return lastFollowingList
    .filter(({ id }) => !oldFollowingList.find((user) => user.id === id));
}

function getStartedFollowingUs({ oldFollowingList, lastFollowingList }) {
  return lastFollowingList
    .filter((user) => (
      oldFollowingList.find(({id, follows_viewer}) => {
        const isSameUser = user.id === id;
        const startedFollowingUs = follows_viewer === false && user.follows_viewer === true;
        return isSameUser && startedFollowingUs;
      }
  )))
}

function startsProssessingFollowingStatistics() {
  const notFollowingBack = followingLists.lastFollowingList
    .filter(({ follows_viewer }) => !follows_viewer)

  const newFollowing = getNewFollowing(followingLists);

  const followedAndFollowedBack = getNewFollowing(followingLists)
    .filter(({followed_by_viewer, follows_viewer}) => followed_by_viewer && follows_viewer)

  const startedFollowingUs = getStartedFollowingUs(followingLists)

  console.log(`START COMPARING FOLLOWING LISTS!
  - Old list ${oldFollowingFileName}
  - Last list ${lastFollowingFileName}
  `);

  //CMD + OPTION + L
  fs.writeFile(
    HISTORY_FOLLOWING_PATH,
    JSON.stringify({
        "NEW_PAGES_WE_FOLLOW": {
          length: newFollowing.length,
          follow: sortBy(newFollowing),
          "followed back": sortBy(followedAndFollowedBack),
        },
        "NOT_FOLLOW_BACK": {
          length: notFollowingBack.length,
          array: sortBy(notFollowingBack),
        },
        "STARTED_FOLLOWING_US": {
          length: startedFollowingUs.length,
          array: sortBy(startedFollowingUs),
        },
      }
    ),
    function (err) {
      if (err) return console.log(err);
    }
  );
}

module.exports.startsProssessingFollowingStatistics = startsProssessingFollowingStatistics;
