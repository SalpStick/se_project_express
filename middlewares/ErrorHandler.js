const { ERROR_CODES, ERROR_MESSAGES } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {

  const status = err.statusCode || ERROR_CODES.SERVER_ERROR;
  const message = err.message || ERROR_MESSAGES.SERVER_ERROR;

  res.status(status).send({ message });
};

module.exports = errorHandler;
