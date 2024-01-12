const { startFollowersStatistics, startFollowingStatistics } = require('./src/index');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Witch function do you want to execute? (1 - startFollowersStatistics, 2 - startFollowingStatistics)\n', (answer) => {
  switch (answer.trim()) {
    case '1':
      startFollowersStatistics().catch(console.error).finally(() => rl.close());
      break;
    case '2':
      startFollowingStatistics().catch(console.error).finally(() => rl.close());
      break;
    default:
      console.log('Invalid selection')
      rl.close();
      break;
  }
});
