// Handler function to wrap each route.
exports.asyncHandler = (cb) => {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
        if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
          const errors = err.errors.map(err => err.message);
          const error = new Error;
          error.status = 400;
          error.message = errors;
          next(error); 
        } else {
          // Forward error to the global error handler
          next(error);
        }
    }
  }
}