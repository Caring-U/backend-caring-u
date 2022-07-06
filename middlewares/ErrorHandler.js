module.exports = (err, req, res, next) => {
    console.log(err.status);
    let errorStatus = err.status || 500;
    let msgError = err.message;

    if (err.name === "userNotFound") {
        msgError;
        errorStatus = 404;
        res.status(errorStatus).json({ message: msgError });
    }

    if(err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError'){
        errorStatus = 400
        msgError = err.errors[0].message
    }

    res.status(errorStatus).json({status : false, message : msgError})
};
