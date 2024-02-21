const fs = require("fs");
const constants = require("../helpers/constants");
const {
  findUser,
  getFollowsList,
  sortBy,
  getPath,
  openFile,
} = require("../common");

const { toValidDate } = require("../helpers/getFileHelper");

const {
  PREVIEWS_FILE_INDEX,
  CURRENT_FILE_INDEX,
  FOLLOWERS_PATH,
  FOLLOWING_PATH,
  HISTORY_FOLLOWERS_PATH,
} = constants;

const previousFollowersFileName = getFollowsList(
  FOLLOWERS_PATH,
  PREVIEWS_FILE_INDEX,
);
const currentFollowersFileName = getFollowsList(
  FOLLOWERS_PATH,
  CURRENT_FILE_INDEX,
);
const currentFollowingFileName = getFollowsList(
  FOLLOWING_PATH,
  CURRENT_FILE_INDEX,
);

const previousFollowersFileDate = new Date(
  toValidDate(previousFollowersFileName),
).toDateString();
const currentFollowersFileDate = new Date(
  toValidDate(currentFollowersFileName),
).toDateString();

const previousFollowersList = getPath(
  FOLLOWERS_PATH,
  previousFollowersFileName,
);
const currentFollowersList = getPath(FOLLOWERS_PATH, currentFollowersFileName);
const currentFollowingList = getPath(FOLLOWING_PATH, currentFollowingFileName);

const followersLists = { previousFollowersList, currentFollowersList };

function getNewFollowers({ previousFollowersList, currentFollowersList }) {
  return currentFollowersList.filter(
    ({ id }) => !findUser(previousFollowersList, id),
  );
}

function getUnfollowers({ previousFollowersList, currentFollowersList }) {
  return previousFollowersList.filter(
    ({ id }) => !findUser(currentFollowersList, id),
  );
}

function getUnfollowersWeFollow(lastWeFollowList, currentUnfollowersList) {
  return currentUnfollowersList.filter(({ id }) =>
    findUser(lastWeFollowList, id),
  );
}

function getRenamedChannel({ previousFollowersList, currentFollowersList }) {
  return currentFollowersList
    .filter(({ id, username }) =>
      previousFollowersList.find(
        (user) => user.id === id && user.username !== username,
      ),
    )
    .map(({ id, username }) => {
      return {
        old: previousFollowersList.find((user) => user.id === id).username,
        current: username,
      };
    });
}

async function startFollowersStatistics() {
  if (!previousFollowersList || !currentFollowersList) {
    throw new Error("At least two files are required to compare data!");
  }

  if (previousFollowersFileDate === currentFollowersFileDate) {
    throw new Error(
      "Files share the same date. This could result in less insightful comparisons!",
    );
  }

  if (!currentFollowingList) {
    throw new Error("No current following list found!");
  }

  const newFollowers = getNewFollowers(followersLists);
  const unfollowers = getUnfollowers(followersLists);
  const unfollowersWeFollow = getUnfollowersWeFollow(
    currentFollowingList,
    unfollowers,
  );
  const renamed = getRenamedChannel(followersLists);

  console.log(`
  START COMPARING FOLLOWERS LISTS!
    - Old list ${previousFollowersFileName} (${previousFollowersFileDate})
    - Last list ${currentFollowersFileName} (${currentFollowersFileDate})
  
  File saved on: ${HISTORY_FOLLOWERS_PATH}
  `);

  await fs.promises.writeFile(
    HISTORY_FOLLOWERS_PATH,
    JSON.stringify(
      {
        NEW_FOLLOWERS: {
          length: newFollowers.length,
          array: sortBy(newFollowers),
        },
        UNFOLLOWED_US: {
          length: unfollowers.length,
          array: sortBy(unfollowers),
        },
        UNFOLLOWED_US_AND_WE_FOLLOW: {
          length: unfollowersWeFollow.length,
          array: sortBy(unfollowersWeFollow),
        },
        RENAMED_CHANNEL: {
          length: renamed.length,
          array: renamed,
        },
      },
      null,
      2,
    ),
  );

  openFile(HISTORY_FOLLOWERS_PATH);
}

module.exports = {
  getRenamedChannel,
  getNewFollowers,
  getUnfollowers,
  getUnfollowersWeFollow,
  startFollowersStatistics,
};
