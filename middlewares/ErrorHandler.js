module.exports = (err, req, res, next) => {
    let errorStatus = err.status || 500;
    let msgError = err.message;

    if (err.name === "userNotFound") {
        msgError;
        errorStatus = 404;
        res.status(errorStatus).json({ message: msgError });
    }
};
