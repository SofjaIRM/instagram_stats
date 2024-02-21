const fs = require("fs");
const constants = require("../helpers/constants");
const { toValidDate } = require("../helpers/getFileHelper");
const {
  findUser,
  getFollowsList,
  sortBy,
  getPath,
  openFile,
} = require("../common");

const {
    PREVIEWS_FILE_INDEX,
    CURRENT_FILE_INDEX,
    FOLLOWING_PATH,
    HISTORY_FOLLOWING_PATH,
} = constants;

const previousFollowingFileName = getFollowsList(FOLLOWING_PATH, PREVIEWS_FILE_INDEX);
const currentFollowingFileName = getFollowsList(FOLLOWING_PATH, CURRENT_FILE_INDEX);

const previousFollowingFileDate = new Date(
  toValidDate(previousFollowingFileName),
).toDateString();
const currentFollowingFileDate = new Date(
  toValidDate(currentFollowingFileName),
).toDateString();

const previousFollowingList = getPath(
  FOLLOWING_PATH,
  previousFollowingFileName,
);
const currentFollowingList = getPath(FOLLOWING_PATH, currentFollowingFileName);

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
  if (!previousFollowingList || !currentFollowingList) {
    throw new Error("At least two files are required to compare data!");
  }

  if (previousFollowingFileDate === currentFollowingFileDate) {
    throw new Error(
      "Files share the same date. This could result in less insightful comparisons!",
    );
  }

  const newUsersWeFollow = getNewUsersWeFollow(followingLists);
  const startedFollowingUs = getUsersStartingFollowingUs(followingLists);

  // Users we follow but are not following back
  const usersNotFollowingUsBack = getUsersNotFollowingBack(currentFollowingList)

  // Users that started following back after we follow them
  const usersStartingFollwingBack = getUsersStartingFollowingBack(followingLists);

  console.log(`
  START COMPARING FOLLOWING LISTS!
    - Old list ${previousFollowingFileName} (${previousFollowingFileDate})
    - Last list ${currentFollowingFileName} (${currentFollowingFileDate})

  File saved on : ${HISTORY_FOLLOWING_PATH}
  `);

  await fs.promises.writeFile(HISTORY_FOLLOWING_PATH, JSON.stringify(
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

  openFile(HISTORY_FOLLOWING_PATH);
}

module.exports = {
  getNewUsersWeFollow,
  getUsersStartingFollowingBack,
  getUsersNotFollowingBack,
  startFollowingStatistics
};
