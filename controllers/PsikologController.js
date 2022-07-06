const {CustomerBooking, User, SchedulePsikolog, ProfilePsikolog} = require('../models')

module.exports = class Controller {
  static async getAllSchedule(req, res, next){ //harus login
    try {
      const data = await SchedulePsikolog.findAndCountAll({
        include : [{
          model : ProfilePsikolog,
          where : {
            UserId : req.user.id //berdasarkan req.user.id yg login, cek nya di auth middleware
          }
        }, {
          model : CustomerBooking,
          include : [User]
        }],
        offset: req.query.page || 0, //untuk pagination
        limit: 5 // tergantung tim FE mau berapa yang keluar
      })
      res.status(200).json({status : true, result : data})
    } catch (error) {
      // next(error)
      console.log(error);
    }
  }

  static async detailSchedule(req, res, next){ //harus login dan kondisikan kepemilikan di middleware
    try {
      const data = await SchedulePsikolog.findOne({
        where : {
          id : req.params.ScheduleId
        },
        include : [{
          model : ProfilePsikolog,
          where : {
            UserId : req.user.id //berdasarkan req.user.id yg login, cek nya di auth middleware
          }
        }, {
          model : CustomerBooking,
          include : [User]
        }]
      })
      res.status(200).json({status : true, result : data})
    } catch (error) {
      // next(error)
      console.log(error);
    }
  }
}