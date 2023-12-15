const CONFIG = {
  FOLLOWERS: {
    HASH: 'c76146de99bb02f6415203be841dd25a',
    PATH: 'edge_followed_by'
  },
  FOLLOWING: {
    HASH: '3dec7e2c57367ef3da3d987d89f9dbc8',
    PATH: 'edge_follow'
  }
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
function afterUrlGenerator(hash, nextCode) {
  return `https://www.instagram.com/graphql/query/?query_hash=${hash}&variables={"id":"${initialData.dsUserId}","include_reel":"true","fetch_mutual":"false","first":"24","after":"${nextCode}"}`
}

const initialData = {
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

let type;
let array;

let scriptSelected = prompt("Which script do you want to run?", "followers");

if (scriptSelected !== "followers") {
  await startScript(CONFIG.FOLLOWING);
} else {
  await startScript(CONFIG.FOLLOWERS);
}

async function saveFile(type, array) {
  console.log(`Start saving all ${type}`);
  const blob = new Blob(["module.exports = ", JSON.stringify(array), ';'], {type: "text/javascript"});
  const fileHandle = await window.showSaveFilePicker({id: type, suggestedName: `${new Date().toGMTString()}.js`})
  const fileStream = await fileHandle.createWritable();
  await fileStream.write(blob);
  await fileStream.close();
  console.log(`End saving all ${type}`);
}

async function startScript(config) {
  const { HASH, PATH } = config;
  const isPathFollowing = PATH === 'edge_follow';
  const isPathFollowers = PATH === 'edge_followed_by';

  if(!initialData.initialURL) {
    initialData.initialURL = `https://www.instagram.com/graphql/query/?query_hash=${HASH}&variables={"id":"${initialData.dsUserId}","include_reel":"true","fetch_mutual":"false","first":"24"}`; //?
  }
  while (initialData.doNext) {
    let receivedData;
    try {
      receivedData = await fetch(initialData.initialURL).then(res => res.json());
    } catch (e) {
      continue;
    }

    initialData.followedPeopleCount || (initialData.followedPeopleCount = receivedData.data.user[PATH].count);

    initialData.doNext = receivedData.data.user[PATH].page_info.has_next_page;
    initialData.initialURL = afterUrlGenerator(HASH, receivedData.data.user[PATH].page_info.end_cursor);
    initialData.unfollowCounter += receivedData.data.user[PATH].edges.length;

    receivedData.data.user[PATH].edges.forEach(x => {
      if (isPathFollowing) {
        const isUnfollower = !x.node.follows_viewer;
        if (isUnfollower) {
          initialData.totalUnfollowers.push(x.node);
        }

        initialData.totalFollowing.push(x.node);
      }
      if (isPathFollowers) {
        initialData.totalFollowers.push(x.node);
      }
    })

    console.log(`%c Progress ${initialData.unfollowCounter}/${initialData.followedPeopleCount} (${parseInt((initialData.unfollowCounter/initialData.followedPeopleCount)*100)}%)`, 'background: #222; color: #bada55;font-size: 35px;');

    await sleep(Math.floor(400 * Math.random()) + 1000);

    initialData.scrollCicle++;

    if (initialData.scrollCicle > 6){
      initialData.scrollCicle = 0;
      console.log(`%c Sleeping 10 segs to prevent getting temp blocked`, 'background: #222; color: ##FF0000;font-size: 35px;');
      await sleep(10000);
    }
  }

  if (isPathFollowing) {
    console.log(`%c ${initialData.totalUnfollowers.length} users don't follow you`, 'background: #222; color: #bada55;font-size: 25px;');
    console.log(`%c ${initialData.totalFollowing.length} users you are following`, 'background: #222; color: #bada55;font-size: 25px;');
    type = 'following';
    array = initialData.totalFollowing;

  }

  if (isPathFollowers) {
    console.log(`%c ${initialData.totalFollowers.length} users don't follow you`, 'background: #222; color: #bada55;font-size: 25px;');
    type = 'followers';
    array = initialData.totalFollowers;
  }

  console.log(`%c All DONE!`, 'background: #222; color: #bada55;font-size: 25px;');
  console.warn('Use saveFile to save data locally');

  if (confirm("Do you want to save it?") === true) {
    await saveFile(type, array);
  }
}
