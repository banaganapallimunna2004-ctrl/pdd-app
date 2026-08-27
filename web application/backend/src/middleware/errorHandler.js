const errorHandler = (err, req, res, next) => {
  console.error(err);
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle MongoDB E11000 duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || 'field';
    const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
    message = `${fieldName} is already registered with another account. Please use a different ${field}.`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    details: err.details || undefined,
  });
};

module.exports = errorHandler;
