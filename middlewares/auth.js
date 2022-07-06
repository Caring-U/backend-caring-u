const { verify } = require("../helpers/jwt")
const { User, SchedulePsikolog } = require("../models")

module.exports = {
    async authentication (req, res, next) {
        try {
            const access_token = req.headers.access_token
            if(!access_token) {
                throw {
                    status: 401,
                    message: "Please Login First!"
                }
            }

            let decoded = verify(access_token)
            const user = await User.findOne({ where : { email: decoded.email }})

            if(!user) throw { status: 401, message : "Please Login First!"}
            req.user = {
                id : user.id,
                username : user.username
            }
            next()
        } catch (error) {
            next(error)
        }
    },
    async authorizeOwnerPsikolog(req, res, next) {
        try {
        const check = await SchedulePsikolog.findOne({
            where : {
                id : req.params.ScheduleId
            }
        })
        if(!check){
            throw {status : 404, message : 'schedule not found'}
        }
        const data = await SchedulePsikolog.findOne({
            where : {
              id : req.params.ScheduleId
            },
            include : [{
              model : ProfilePsikolog,
              where : {
                UserId : req.user.id 
              }
            }]
          })
          if (!data) {
            throw {status : 403, message : 'not access in here'}
          }
        next()
        }catch (error) {
            next(error)
        }
    }
}