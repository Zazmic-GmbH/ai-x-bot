const { Translate } = require("@google-cloud/translate").v2;

const translate = new Translate({
  projectId: process.env.GCP_PROJECT_ID,
  key: process.env.TRANSLATION_API_KEY,
});

async function translateText(text) {
  let target = "de";
  let [translations] = await translate.translate(text, target);
  translations = Array.isArray(translations) ? translations : [translations];
  console.log(`${target} => ${translations[0]}`);
  return translations[0];
}

module.exports = {
  translateText,
};
