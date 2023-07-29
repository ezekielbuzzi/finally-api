const AppError = require("../util/AppError");

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateKeyError = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `User with the email ${value} alreday exits. Please use another email.`;

  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;

  return new AppError(message, 400);
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(err.statusCode).json({
      status: "error",
      message: "Ops! Something went wrong!",
    });
  }
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (err.name === "CastError") {
      error = handleCastError(err);
    }

    if (err.code === 11000) {
      error = handleDuplicateKeyError(err);
    }

    if (err.name === "ValidationError") {
      error = handleValidationError(err);
    }

    if (
      err.name === "CastError" ||
      err.code === 11000 ||
      err.name === "ValidationError"
    ) {
      sendErrorProd(error, res);
    } else {
      sendErrorProd(err, res);
    }
  } else {
    sendErrorDev(err, res);
  }
};
