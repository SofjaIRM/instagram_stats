const INSTAGRAM_CONFIG = {
  FOLLOWERS: {
    HASH: 'c76146de99bb02f6415203be841dd25a',
    PATH: 'edge_followed_by',
    NAME: 'followers',
  },
  FOLLOWING: {
    HASH: '3dec7e2c57367ef3da3d987d89f9dbc8',
    PATH: 'edge_follow',
    NAME: 'following'
  },
  LOG_STYLE: "background: #222; color: #bada55; font-size: 25px;",
  SERVER_URL: "https://www.instagram.com/graphql/query/",
  EDGE_FOLLOW: "edge_follow",
  EDGE_FOLLOWED_BY: "edge_followed_by",
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift()
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function generateUrlParams(hash, ds_user_id, nextCode) {
  let params = `?query_hash=${hash}&variables={"id":"${ds_user_id}","include_reel":"true","fetch_mutual":"false","first":"24"`;
  if (nextCode) {
    params +=`,"after":"${nextCode}"`;
  }
  return `${params}}`;
}

function generateInitialUrl(hash, ds_user_id) {
  return `${INSTAGRAM_CONFIG.SERVER_URL}${generateUrlParams(hash, ds_user_id)}`;
}
function generateNextUrl(hash, ds_user_id, nextCode) {
  return `${INSTAGRAM_CONFIG.SERVER_URL}${generateUrlParams(hash, ds_user_id, nextCode)}`
}

const scriptState = {
  dsUserId: getCookie("ds_user_id"),
  followedPeopleCount: null,
  totalUnfollowers: [],
  totalFollowing: [],
  totalFollowers: [],
  unfollowCounter: 0,
  scrollCicle: 0,
  doNext: true,
  initialURL: null,
}

let followType;
let followList;

let scriptSelected = prompt("Which script do you want to run? (opt: followers or following)", "followers");


function generateStyledLog(message) {
  const style = 'background: #222; color: #bada55; font-size: 25px;'
  console.log(`%c ${message}`, style);
}

async function startExecution(scriptSelected) {
  switch (scriptSelected.toString().toLowerCase()) {
    case INSTAGRAM_CONFIG.FOLLOWERS.NAME:
      await startScript(INSTAGRAM_CONFIG.FOLLOWERS, scriptState);
      break;
    case INSTAGRAM_CONFIG.FOLLOWING.NAME:
      await startScript(INSTAGRAM_CONFIG.FOLLOWING, scriptState);
      console.log('IS COMMING TO FOLLOWING TOO');
      break;
    default:
      console.log('You didn\'t select any of the available options');
  }
}

async function saveFile(followType, followList) {
  try {
    generateStyledLog(`Start saving all ${followType} ⏳`)
    const blob = new Blob(["module.exports = ", JSON.stringify(followList), ';'], {type: "text/javascript"});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${new Date().getTime()}.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    generateStyledLog(`End saving all ${followType} ⌛`)
  } catch (err) {
    console.error(err);
  }
}

async function startScript(config, scriptData) {
  const { HASH, PATH } = config;
  const isPathFollowing = PATH === INSTAGRAM_CONFIG.EDGE_FOLLOW;
  const isPathFollowers = PATH === INSTAGRAM_CONFIG.EDGE_FOLLOWED_BY;

  if(!scriptData.initialURL) {
    scriptData.initialURL = generateInitialUrl(HASH, scriptData.dsUserId);
  }

  scriptData = await collectEdgeData(scriptData, HASH, PATH, isPathFollowing, isPathFollowers);

  if (isPathFollowing) {
    generateStyledLog(`You follow ${scriptState.totalFollowing.length} users`);
    generateStyledLog(`${scriptState.totalUnfollowers.length} users don't follow you back`);
    followType = 'following';
    followList = scriptState.totalFollowing;
  }

  if (isPathFollowers) {
    generateStyledLog(`${scriptState.totalFollowers.length} users follow you`);
    followType = 'followers';
    followList = scriptState.totalFollowers;
  }

  generateStyledLog("All DONE! 🚀");
  console.warn(
    '%c If download doesn\'t start automatically, please paste %csaveFile(followType, followList)%c and press return in order to start',
    'font-size: 18px;', 'font-size: 18px; font-weight: bold;', 'font-size: 18px; font-weight: normal;'
  );

  if (confirm("Do you want to save it?") === true) {
    await saveFile(followType, followList);
  }

  return scriptData;
}

async function collectEdgeData(scriptData, hash, path, isPathFollowing, isPathFollowers) {
  while (scriptData.doNext) {
    let receivedData;
    try {
      receivedData = await fetch(scriptData.initialURL).then(res => res.json());
    } catch (e) {
      continue;
    }

    scriptData = processData(receivedData, scriptData, hash, path, isPathFollowing, isPathFollowers);

    showProgressBar(scriptData);

    await sleep(Math.floor(400 * Math.random()) + 1000);

    scriptData.scrollCicle++;

    if (scriptData.scrollCicle > 6){
      scriptData.scrollCicle = 0;
      await sleep(10000); // Sleeping 10 segs to prevent getting temp blocked
    }
  }

  return scriptData;
}

function calculateProgressBar(scriptData) {
  let progress = 0;

  for(let i = 0; i < (scriptData.unfollowCounter/scriptData.followedPeopleCount)*100; i+=10) {
    progress++;
  }
  return buildProgressBar(scriptData, progress);
}

function showProgressBar(scriptData) {
  const percentage = `${Math.floor((scriptData.unfollowCounter/scriptData.followedPeopleCount)*100)}%`;
  const progressBar = calculateProgressBar(scriptData);

  console.clear();
  console.log(
    `%c Progress: %c${(progressBar)} %c${percentage} (${scriptData.unfollowCounter}/${scriptData.followedPeopleCount})`
    , INSTAGRAM_CONFIG.LOG_STYLE, INSTAGRAM_CONFIG.LOG_STYLE.concat('color: #FFD700'), INSTAGRAM_CONFIG.LOG_STYLE
  );
}

function buildProgressBar(scriptData, progress) {
  const filledBlocks = Array(Math.round(progress)).fill('█');
  const emptyBlocks = Array(10 - Math.round(progress)).fill('..');

  return filledBlocks.concat(emptyBlocks).join('');
}

function processData(receivedData, scriptData, HASH, PATH, isPathFollowing, isPathFollowers) {
  scriptData.followedPeopleCount = scriptData.followedPeopleCount || receivedData.data.user[PATH].count;
  scriptData.doNext = receivedData.data.user[PATH].page_info.has_next_page;
  scriptData.initialURL = generateNextUrl(HASH, scriptData.dsUserId, receivedData.data.user[PATH].page_info.end_cursor);
  scriptData.unfollowCounter += receivedData.data.user[PATH].edges.length;

  receivedData.data.user[PATH].edges.forEach(x => {
    if (isPathFollowing) {
      const isUnfollower = !x.node.follows_viewer;
      if (isUnfollower) {
        scriptData.totalUnfollowers.push(x.node);
      }

      scriptData.totalFollowing.push(x.node);
    }
    if (isPathFollowers) {
      scriptData.totalFollowers.push(x.node);
    }
  })

  return scriptData;
}

startExecution(scriptSelected).then((result) => result);
