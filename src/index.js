const readline = require('readline');
const { startFollowersStatistics } = require('./followers');
const { startFollowingStatistics } = require('./following');

const setColor = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  reset: (text) => `\x1b[0m${text}\x1b[0m`
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = () => {
  rl.question(
    setColor.reset("\nWhich function do you want to execute? (Select one of the following options)\n(1 - startFollowersStatistics, 2 - startFollowingStatistics, exit - stop running code)\n"),
    async (answer) => {
      console.log(`\nOption Selected: ${answer}`);

      switch (answer.trim()) {
        case '1':
          try {
            console.log(setColor.reset('Running startFollowersStatistics...'));
            await startFollowersStatistics();
            console.log(setColor.green('startFollowersStatistics finished successfully'));
            rl.close();
            process.stdin.end();
          } catch (error) {
            console.error(setColor.red('Error running startFollowersStatistics: '), setColor.red(error.message));
            askQuestion();
          }
          break;
        case '2':
          try {
            console.log(setColor.reset('Running startFollowingStatistics...'));
            await startFollowingStatistics();
            console.log(setColor.green('startFollowingStatistics finished successfully'));
            rl.close();
            process.stdin.end();
          } catch (error) {
            console.error(setColor.red('Error running startFollowingStatistics: '), setColor.red(error.message));
            askQuestion();
          }
          break;
        case 'exit': {
          rl.question(setColor.reset('Are you sure you want to exit? (y/n)'), (answer) => {
            if (answer.match(/^y(es)?$/i)) {
              rl.close();
              process.stdin.end();
            } else{
              askQuestion();
            }
          })}
          break;
        default:
          console.error(setColor.red('Invalid selection! Select a valid option!'));
          askQuestion(); // repete a pergunta
          break;
      }
    });
}

askQuestion();
