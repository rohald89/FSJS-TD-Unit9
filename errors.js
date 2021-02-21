const notFound = ((req, res, next) => {
    const error = new Error;
    error.message = 'This page can not be found';
    error.status = 404;
    next(error);
});
  
  // Global error handler
const globalError = ((err, req, res, next) => {

    res.status(err.status || 500).json({ err });
});

module.exports = { notFound, globalError };