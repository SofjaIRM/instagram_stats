const CONSTANTS = {
  OLD_FILE_INDEX: 1,
  LAST_FILE_INDEX: 0,
  DIR_FOLLOWERS_PATH: './lists/followers',
  DIR_FOLLOWING_PATH: './lists/following',
  HISTORY_FOLLOWERS_PATH: `./history/followers/${new Date().toGMTString()}.json`,
  HISTORY_FOLLOWING_PATH: `./history/following/${new Date().toGMTString()}.json`,
}

module.exports = {
  CONSTANTS,
};
