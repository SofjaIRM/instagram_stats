# Instagram User Statistics Helper

This project comprises two JavaScript scripts: one to be run in your browser's console to collect data from Instagram,
and another one to be run in a Node.js environment to process the gathered data.

## First script

This script application is designed for the browser console to interact with Instagram's GraphQL
queries and generate useful statistics about your followers and following on Instagram.

## Features

The application can:

- Retrieve followers and following data.
- Save this data to your local system.
- Calculate statistics, such as the percentage of followers who are following back and who started following you.

It uses Instagram's GraphQL APIs to fetch this data directely from your browser.

## First Step: Data Gathering in Browser

1. Open Instagram on your web browser and log in.
2. Open the JavaScript console in your browser. In Chrome, you do this by right-clicking an element on the page, choosing 'Inspect', and navigating to the 'Console' tab.
3. Copy the entire JavaScript code provided inside the `script` file and paste it into your console, then hit `Enter`.

A prompt will appear asking which type of script you want to run: 'followers' or 'following'.

After the script finishes executing, a confirmation dialog will appear asking if you want to save the processed data. If for any reason you could not save the file,
you can manually run `saveFile(followType, followList)`. Make sure to save the data for later use and leave it with the name sugested as it is the timestamp for the
current day you are saving it.

**Note**: You must be logged into Instagram in your browser for this script to work.

## Second Step: Data Processing with Node.js

After collecting and saving data from Instagram using the in-browser script, you can process the data using the Node.js application included in this project.

Remember, you should run the `script` file at least twice, on different days, to generate meaningful comparisons.

1. Clone the project repository and navigate into the project directory.
2. Install the project's dependencies using the `yarn install` command.
3. Now you must put the files inside the `list` directory, inside `followers` or `following` depending on the files you generated before.
4. Run the Node.js script using the command `yarn start`.

The Node.js script will interact with you via the terminal, taking input to start statistics computations for followers
and following lists from the previously saved JSON files. It reads from files, performs computations, and writes the results to output files.

After running the Node.js script, it will save a file automaticaly to the `history` directory. If the file doesn't open automaticaly, you can find it [here](./history). These
might include details such as who started following you, which pages you've recently followed, number of followers and following, etc.
