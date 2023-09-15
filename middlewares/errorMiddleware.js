function errorMiddleware(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const stack = err.stack || "";

  console.error(stack);

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
    },
  });
}

module.exports = errorMiddleware;
