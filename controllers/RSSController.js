let Parser = require('rss-parser');
let parser = new Parser();

async function fetchRSS() {
  try {
    console.log("fetching RSS", process.env.RSS_URL);
    let feed = await parser.parseURL(process.env.RSS_URL);
    let resultArray = [];

    feed.items.forEach(item => {
      resultArray.push({
        title: item.title,
        content: item.content,
      })
    });
    return resultArray;
  } catch (error) {
    console.error("Error fetching RSS:", error);
  }
}

module.exports = {
  fetchRSS,
};
