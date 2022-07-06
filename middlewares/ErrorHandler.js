module.exports = (err, req, res, next) => {
    let errorStatus = err.status || 500;
    let msgError = err.message;

    if (err.name === "NotFound") {
        msgError;
        errorStatus = 404;
    } else if (err.name === "Forbidden") {
        msgError;
        errorStatus = 403;
    }

    res.status(errorStatus).json({ message: msgError });
};
