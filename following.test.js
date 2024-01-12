const {
  getNewUsersWeFollow,
  getUsersStartingFollowingBack,
  getUsersNotFollowingBack
} = require("./src/following");

const mockFollowing = {
  previousFollowingList: [
    {
      "id": "51687505236",
      "username": "buildingamazing",
      "followed_by_viewer": true,
      "follows_viewer": false
    },
    {
      "id": "50737127618",
      "username": "perfection_not_found",
      "followed_by_viewer": false,
      "follows_viewer": false
    },
    {
      "id": "50810379889",
      "username": "mocking_star",
      "followed_by_viewer": false,
      "follows_viewer": false
    },
    {
      "id": "50810009889",
      "username": "great_user",
      "followed_by_viewer": false,
      "follows_viewer": false
    },
  ],
  currentFollowingList: [
    {
      "id": "51687505236",
      "username": "buildingamazing",
      "followed_by_viewer": true,
      "follows_viewer": true
    },
    {
      "id": "50737127618",
      "username": "perfection_not_found",
      "followed_by_viewer": false,
      "follows_viewer": false
    },
    {
      "id": "51616213048",
      "username": "hello.worlding",
      "followed_by_viewer": false,
      "follows_viewer": false
    },
    {
      "id": "50810009889",
      "username": "greater_than_ever",
      "followed_by_viewer": false,
      "follows_viewer": false
    },
  ],
}

test("it should filter by instagram users we follow", () => {
  const expected = [
    {
      "id": "51616213048",
      "username": "hello.worlding",
      "followed_by_viewer": false,
      "follows_viewer": false
    },
  ];

  expect(getNewUsersWeFollow(mockFollowing)).toEqual(expected);
});

test("it should filter by followers starting following after we follow", () => {
  const expected = [
    {
      "id": "51687505236",
      "username": "buildingamazing",
      "followed_by_viewer": true,
      "follows_viewer": true
    },
  ];

  expect(getUsersStartingFollowingBack(mockFollowing)).toEqual(expected);
});

test("it should filter by accounts not following back after we follow", () => {
  const expected = [
    {
      "id": "50737127618",
      "username": "perfection_not_found",
      "followed_by_viewer": false,
      "follows_viewer": false
    },
    {
      "id": "51616213048",
      "username": "hello.worlding",
      "followed_by_viewer": false,
      "follows_viewer": false
    },
    {
      "id": "50810009889",
      "username": "greater_than_ever",
      "followed_by_viewer": false,
      "follows_viewer": false
    },
  ];

  expect(getUsersNotFollowingBack(mockFollowing.currentFollowingList)).toEqual(expected);
});
