module.exports.CustomError = function(
    message = 'Oops! Something bad happened.',
    statusCode = 500,
  ) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};
