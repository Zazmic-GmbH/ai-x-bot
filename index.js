const express = require("express");
const bodyParser = require("body-parser");
const logger = require("./middlewares/loggerMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");
const corsMiddleware = require("./middlewares/corsMiddleware");

require("dotenv").config();
const schedule = require("node-schedule");
const { generateTweet } = require("./controllers/XController");
const { translateText } = require("./controllers/TranslateController");

const app = express();
const port = process.env.PORT || 80;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(corsMiddleware);
app.use(logger);

// Routes setup
app.use("/tweet", async (req, res) => {
  let tweet = await generateTweet(req, res);
  let result = await translateText(tweet);

  return res.status(200).json(result);
});

// Error middleware
app.use(errorMiddleware);

// Schedule the job once a day at midnight
schedule.scheduleJob("0 0 * * *", () => {
  generateTweet();
});
// test run, comment before deploy to prod
generateTweet();

// Start the server
app.listen(port, () => console.log(`Server listening on port ${port}`));
