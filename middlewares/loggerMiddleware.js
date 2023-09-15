const loggerMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  res.on("finish", () => {
    console.log(
      `[${new Date().toISOString()}] ${res.statusCode} ${res.statusMessage}; ${
        res.get("Content-Length") || 0
      }b sent`
    );
  });

  next();
};

module.exports = loggerMiddleware;
