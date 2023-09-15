const axios = require("axios");

const { getAccessToken } = require("../utils/GoogleAuthUtils");
const { fetchRSS } = require("./RSSController");
const { translateText } = require("./TranslateController");
const { generateImage } = require("./ImageController");

async function generate(accessToken, rssData) {
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
  try {
    let accessToken = await getAccessToken();

    // Fetch RSS
    let rssData = await fetchRSS();
    
    // Generate tweet
    let tweet = await generate(accessToken, rssData);

    // Translate tweet
    //let translation = await translateText(tweet);
    let translation = tweet;

    // Generate image
    let url = await generateImage(translation);

    return translation;
  } catch (err) {
    console.error(err);
    //res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  generateTweet,
};
