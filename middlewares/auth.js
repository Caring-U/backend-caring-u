const { verify } = require("../helpers/jwt")
const { User } = require("../models")

module.exports = {
    async authentication (req, res, next) {
        try {
            const access_token = req.headers.access_token
            if(!access_token) {
                throw {
                    status: false,
                    message: "Please Login First!"
                }
            }

            let decoded = verify(access_token)
            const user = await User.findOne({ where : { email: decoded.email }})

            if(!user) throw { status: false, message : "Please Login First!"}
            req.user = user
            next()
        } catch (error) {
            next(err)
        }
    }
}