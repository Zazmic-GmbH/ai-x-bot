const cors = require("cors");

const corsMiddleware = cors({
  origin: "*", // set the origin of the request to allow all domains
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
});

module.exports = corsMiddleware;
