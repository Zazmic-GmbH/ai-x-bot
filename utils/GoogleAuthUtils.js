const { JWT } = require("google-auth-library");

async function getAccessToken() {
  const jwtClient = new JWT({
    email: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
    key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY,
    scopes: [process.env.SERVICE_ACCOUNT_SCOPES],
  });

  try {
    const tokenResponse = await jwtClient.getAccessToken();
    const accessToken = tokenResponse.token;
    return accessToken;
  } catch (error) {
    console.error("Error generating access token:", error.message);
    throw error;
  }
}

module.exports = {
  getAccessToken,
};
