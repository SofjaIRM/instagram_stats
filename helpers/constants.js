const baseDirectory = require('../baseDirectory');

module.exports = Object.freeze({
    PREVIEWS_FILE_INDEX: 1,
    CURRENT_FILE_INDEX: 0,
    FOLLOWERS_PATH: `${baseDirectory}/lists/followers/`,
    FOLLOWING_PATH: `${baseDirectory}/lists/following/`,
    HISTORY_FOLLOWERS_PATH: `${baseDirectory}/history/followers/${new Date().toGMTString()}.json`,
    HISTORY_FOLLOWING_PATH: `${baseDirectory}/history/following/${new Date().toGMTString()}.json`,
    SYSTEM_FILES_LIST : [
      '^npm-debug\\.log$',
      '^\\..*\\.swp$',
      '^\\.DS_Store$',
      '^\\.AppleDouble$',
      '^\\.LSOverride$',
      '^Icon\\r$',
      '^\\._.*',
      '^\\.Spotlight-V100(?:$|\\/)',
      '\\.Trashes',
      '^__MACOSX$',
      '~$',
      '^Thumbs\\.db$',
      '^ehthumbs\\.db$',
      '^[Dd]esktop\\.ini$',
      '@eaDir$',
    ]
  }
);
