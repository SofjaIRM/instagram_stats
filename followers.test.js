const {
  getRenamedChannel,
  getNewFollowers,
  getUnfollowers,
  getUnfollowersWeFollow,
} = require("./src/followers");

const mockFollowing = [
  { "id": "51687505236", "username": "buildingamazing" },
  { "id": "50737127618", "username": "perfection_not_found" },
  { "id": "50810379889", "username": "puffolize_official" }
];

const mockFollowers = {
  previousFollowersList: [
    { "id": "51687505236", "username": "buildingamazing" },
    { "id": "50737127618", "username": "perfection_not_found" },
    { "id": "50810379889", "username": "mocking_star" },
    { "id": "50810009889", "username": "great_user" }
  ],
  currentFollowersList: [
    { "id": "51616213048", "username": "hello.worlding" },
    { "id": "51687505236", "username": "buildingamazing" },
    { "id": "50737127618", "username": "perfection_not_found" },
    { "id": "50810009889", "username": "greater_than_ever" }
  ],
}

test('it should filter by new instagram followers', () => {
  const expected = [
    { "id": "51616213048", "username": "hello.worlding" },
  ];

  expect(getNewFollowers(mockFollowers)).toEqual(expected);
});

test('it should filter by instagram unfollowers', () => {
  const expected = [
    { "id": "50810379889", "username": "mocking_star" },
  ];

  expect(getUnfollowers(mockFollowers)).toEqual(expected);
});

test('it should filter by unfollowers whom we follow', () => {
  const expected = [
    { "id": "50810379889", "username": "mocking_star" },
  ];

  expect(getUnfollowersWeFollow(mockFollowing, expected)).toEqual(expected);
});

test('it should filter by instagram renamed accounts', () => {
  const expected = [
    { "old": "great_user", "current": "greater_than_ever" },
  ]

  expect(getRenamedChannel(mockFollowers)).toEqual(expected);
});
