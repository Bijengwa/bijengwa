const ApiError = require('../utils/ApiError');
const env = require('../config/env');

function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Request body too large',
    });
  }

  const statusCode = err instanceof ApiError
    ? err.statusCode
    : err.statusCode || 500;

  if (statusCode >= 500) {
    console.error('[ERROR]', err.message);
    if (env.NODE_ENV !== 'production') {
      console.error(err);
    }
  }

  const message = statusCode >= 500 && env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message || 'Internal server error';

  const payload = {
    success: false,
    message,
  };

  if (err.details && statusCode < 500) {
    payload.details = err.details;
  }

  return res.status(statusCode).json(payload);
}

module.exports = { notFoundHandler, errorHandler };
