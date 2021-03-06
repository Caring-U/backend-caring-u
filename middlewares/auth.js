const { verify } = require("../helpers/jwt");
const { User, CustomerBooking, SchedulePsikolog, ProfilePsikolog } = require("../models");

module.exports = {
    async authentication(req, res, next) {
        try {
            const access_token = req.headers.access_token;
            if (!access_token) {
                throw {
                    status: 401,
                    message: "Please Login First!",
                };
            }

            let decoded = verify(access_token);
            const user = await User.findOne({ where: { email: decoded.email } });

            //kirimkan email juga
            if (!user) throw { status: 401, message: "Please Login First!" };
            req.user = {
                id: user.id,
                username: user.username,
                email : user.email,
                role: user.role
            };
            next();
        } catch (error) {
            next(error);
        }
    },

    async authorizeClientOwner(req, res, next) {
        try {
            // cek Customer Booking apakah ada atau tidak
            const checkingCustomerBooking = await CustomerBooking.findByPk(req.params.custBookingId);
            if (!checkingCustomerBooking) throw { name: "NotFound", message: "Customer Booking Not Found" };

            // cek kepemilikan customer booking dan allowed access
            if (checkingCustomerBooking.UserId != req.user.id) throw { name: "Forbidden", message: "not Allowed access" };
            next();
        } catch (error) {
            next(error);
        }
    },

    async authorizeOwnerPsikolog(req, res, next) {
        try {
            const check = await SchedulePsikolog.findOne({
                where: {
                    id: req.params.ScheduleId,
                },
            });
            if (!check) {
                throw { status: 404, message: "schedule not found" };
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
    },

    async checkFoundProfilePsikolog(req, res, next){
        try {
          const check = await ProfilePsikolog.findOne({
            where : {
              UserId: req.user.id
            }
          })
          if(!check){
            next()
          }else{
            throw {status : 403, message : "you have created a profile"}
          }
        } catch (error) {
          next(error)
        }
    },

    async checkProfilePsikolog(req, res, next){
        try {
          const check = await ProfilePsikolog.findOne({
            where : {
              UserId: req.user.id
            }
          })
          if(!check){
            throw {status : 403, message : "please create your profile"}
          }else{
            req.profilePsikolog = {
                id : check.id
            }
            next()
          }
        } catch (error) {
          next(error)
        }
      },

      authorizeAdmin (req, res, next) {
        if (req.user.role === 'admin') {
            next()
        } else {
            next({status : 403, message : 'You Cannot Access To Change Status Psikolog'})
        }
    },
}
