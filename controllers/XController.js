const axios = require("axios");

const { TwitterApi } = require("twitter-api-v2");

const { getAccessToken } = require("../utils/GoogleAuthUtils");
const { fetchRSS } = require("./RSSController");
const { translateText } = require("./TranslateController");
const { generateImage } = require("./ImageController");

async function generateContent(accessToken, rssData) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  if (rssData) {
    let number = Math.floor(Math.random() * (rssData.length - 1));
    let title = rssData[number].title;
    let content = rssData[number].content;
    console.log("=> Origintal content: ");
    console.log(title, content);

    const postData = JSON.stringify({
      instances: [
        {
          content: `Generate a tweet about a provided topic, rephrasing it differently. The title will be: "${title}"; and the description of the subject will be: "${content}".`,
        },
      ],
      parameters: {
        temperature: 0.2,
        maxOutputTokens: 1024,
        topP: 0.8,
        topK: 40,
      },
    });

    const response = await axios.post(
      `https://${process.env.AI_API_ENDPOINT}/v1/projects/${process.env.GCP_PROJECT_ID}/locations/${process.env.GCP_REGION}/publishers/google/models/${process.env.GCP_MODEL_ID}:predict`,
      postData,
      {
        headers: headers,
      }
    );
    console.log("123");
    const parsedObject = response.data;
    if (parsedObject.predictions[0].content === undefined) {
      throw new Error("Error generating a tweet");
    } else {
      const res = parsedObject.predictions[0].content;
      console.log("=> Generated content: ");
      console.log(res);
      return res;
    }
  } else {
    console.log("Error fetching RSS");
  }
}

const generateTweet = async (req, res) => {
  // Get access token
  let accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Error getting access token");
  }

  // Fetch RSS
  let rssData = await fetchRSS();
  if (!rssData) {
    throw new Error("Error fetching RSS");
  }

  // Generate tweet
  let content = await generateContent(accessToken, rssData);
  if (!content) {
    throw new Error("Error generating content");
  }

  // Translate tweet
  let translation = await translateText(content);
  if (!translation) {
    throw new Error("Error translating content");
  }

  // Generate image
  let url = await generateImage(translation);
  if (!url) {
    throw new Error("Error generating image");
  }

  // Post tweet with image
  let tweetId = await postTweet(url, translation);
  console.log("=> Tweet posted: ", tweetId);
  if (!tweetId) {
    throw new Error("Error posting tweet");
  }

  return tweetId;
};

async function postTweet(url, content) {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  const tweet = await client.v2.tweet(content, {
    media: url,
  });

  console.log(tweet);
  return tweet.id_str;
}

module.exports = {
  generateTweet,
};
