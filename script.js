const config = {
  followers: {
    hash: 'c76146de99bb02f6415203be841dd25a',
    path: 'edge_followed_by'
  },
  following: {
    hash: '3dec7e2c57367ef3da3d987d89f9dbc8',
    path: 'edge_follow'
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
  return `https://www.instagram.com/graphql/query/?query_hash=${hash}&variables={"id":"${ds_user_id}","include_reel":"true","fetch_mutual":"false","first":"24","after":"${nextCode}"}`
}

let followedPeopleCount;
let type;
let array;
let ds_user_id = getCookie("ds_user_id");
let initialURL = null;
let doNext = true;
let allUnfollowers = [];
let allFollowing = []
let allFollowers = [];
let getUnfollowCounter = 0;
let scrollCicle = 0;


let scriptSelected = prompt("Which script do you want to run?", "followers");

if (scriptSelected !== "followers") {
  await startScript(config.following);
} else {
  await startScript(config.followers);
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
  const { hash, path } = config;
  const isPathFollowing = path === 'edge_follow';
  const isPathFollowers = path === 'edge_followed_by';

  if(!initialURL) {
    initialURL = `https://www.instagram.com/graphql/query/?query_hash=${hash}&variables={"id":"${ds_user_id}","include_reel":"true","fetch_mutual":"false","first":"24"}`;
  }
  while (doNext) {
    let receivedData;
    try {
      receivedData = await fetch(initialURL).then(res => res.json());
    } catch (e) {
      continue;
    }

    followedPeopleCount || (followedPeopleCount = receivedData.data.user[path].count);

    doNext = receivedData.data.user[path].page_info.has_next_page;
    initialURL = afterUrlGenerator(hash, receivedData.data.user[path].page_info.end_cursor);
    getUnfollowCounter += receivedData.data.user[path].edges.length;

    receivedData.data.user[path].edges.forEach(x => {
      if (isPathFollowing) {
        const isUnfollower = !x.node.follows_viewer;
        if (isUnfollower) {
          allUnfollowers.push(x.node);
        }

        allFollowing.push(x.node);
      }
      if (isPathFollowers) {
        allFollowers.push(x.node);
      }
    })

    console.log(`%c Progress ${getUnfollowCounter}/${followedPeopleCount} (${parseInt((getUnfollowCounter/followedPeopleCount)*100)}%)`, 'background: #222; color: #bada55;font-size: 35px;');

    await sleep(Math.floor(400 * Math.random()) + 1000);

    scrollCicle++;

    if (scrollCicle > 6){
      scrollCicle = 0;
      console.log(`%c Sleeping 10 segs to prevent getting temp blocked`, 'background: #222; color: ##FF0000;font-size: 35px;');
      await sleep(10000);
    }
  }

  if (isPathFollowing) {
    console.log(`%c ${allUnfollowers.length} users don't follow you`, 'background: #222; color: #bada55;font-size: 25px;');
    console.log(`%c ${allFollowing.length} users you are following`, 'background: #222; color: #bada55;font-size: 25px;');
    type = 'following';
    array = allFollowing;

  }

  if (isPathFollowers) {
    console.log(`%c ${allFollowers.length} users don't follow you`, 'background: #222; color: #bada55;font-size: 25px;');
    type = 'followers';
    array = allFollowers;
  }

  console.log(`%c All DONE!`, 'background: #222; color: #bada55;font-size: 25px;');
  console.warn('Use saveFile to save data locally');

  if (confirm("Do you want to save it?") === true) {
    await saveFile(type, array);
  }
}
