const readline = require("readline");
const process = require("process");
const { startFollowersStatistics } = require("./followers");
const { startFollowingStatistics } = require("./following");

const setColor = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  reset: (text) => `\x1b[0m${text}\x1b[0m`,
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const actionsMap = {
  1: { func: startFollowersStatistics, name: "startFollowersStatistics" },
  2: { func: startFollowingStatistics, name: "startFollowingStatistics" },
  exit: { func: () => Promise.resolve(), exit: true },
};

const askQuestion = () => {
  rl.question(
    setColor.reset(
      "\nWhich function do you want to execute? " +
        "(Select one of the following options)\n(1 - startFollowersStatistics, " +
        "2 - startFollowingStatistics, exit - stop running code)\n",
    ),
    handleAnswer,
  );
};

const handleAnswer = async (answer) => {
  console.log(`\nOption Selected: ${answer}`);
  const answerAction = actionsMap[answer.trim()];

  if (!answerAction) {
    console.error(setColor.red("Invalid selection! Select a valid option!"));
    return askQuestion();
  }

  if (answerAction.exit) {
    return rl.question(
      setColor.reset("Are you sure you want to exit? (y,n)"),
      (newAnswer) => {
        if (newAnswer.match(/^y(es)?$/i)) {
          rl.close();
          process.stdin.end();
        } else {
          askQuestion();
        }
      },
    );
  }

  try {
    console.log(setColor.reset(`Running ${answerAction.name}...`));
    await answerAction.func();
    console.log(setColor.green(`${answerAction.name} finished successfully`));
    rl.close();
    process.stdin.end();
  } catch (error) {
    console.error(
      setColor.red(`Error running ${answerAction.name}: `),
      setColor.red(error.message),
    );
    askQuestion();
  }
};

askQuestion();
