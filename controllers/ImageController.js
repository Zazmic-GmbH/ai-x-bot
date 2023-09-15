const axios = require("axios");

async function generateImage(text) {
  let prompt = text;
  let url = `${process.env.IMAGE_API_ENDPOINT}?prompt=${prompt}`;
  const response = await axios.get(url);
  console.log("=> Generated Image: ", response.data);
  return response.data;
}

module.exports = {
  generateImage,
};
