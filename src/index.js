const readline = require('readline');
const { startFollowersStatistics } = require('./followers');
const { startFollowingStatistics } = require('./following');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = () => {
  rl.question("\nWhich function do you want to execute? (Select one of the following options)\n(1 - startFollowersStatistics, 2 - startFollowingStatistics, exit - stop running code)\n", async (answer) => {
    console.log(`\nOption Selected: ${answer}`);

    switch (answer.trim()) {
      case '1':
        try {
          console.log('Running startFollowersStatistics...');
          await startFollowersStatistics();
          console.log('startFollowersStatistics finished successfully');
          rl.close();
          process.stdin.end();
        } catch (error) {
          console.error('Error running startFollowersStatistics: ', error.message);
          askQuestion();
        }
        break;
      case '2':
        try {
          console.log('Running startFollowingStatistics...');
          await startFollowingStatistics();
          console.log('startFollowingStatistics finished successfully');
          rl.close();
          process.stdin.end();
        } catch (error) {
          console.error('Error running startFollowingStatistics: ', error.message);
          askQuestion();
        }
        break;
      default:
        console.error('\x1b[31mInvalid selection! Select a valid option!\x1b[0m');
        askQuestion(); // repete a pergunta
        break;
    }
  });
}

askQuestion();
