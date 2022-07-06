module.exports = (err, req, res, next) => {
    console.log(err.status);
    let errorStatus = err.status || 500;
    let msgError = err.message;

    if (err.name === "NotFound") {
        msgError;
        errorStatus = 404;
    } else if (err.name === "Forbidden") {
        msgError;
        errorStatus = 403;
    }

    if(err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError'){
        errorStatus = 400
        msgError = err.errors[0].message
    }

    res.status(errorStatus).json({status : false, message : msgError})
};
