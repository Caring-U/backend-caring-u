const {CustomerBooking, User, SchedulePsikolog, ProfilePsikolog} = require('../models')

module.exports = class Controller {
  static async getAllSchedule(req, res, next){ 
    try {
      const data = await SchedulePsikolog.findAndCountAll({
        include : [{
          model : ProfilePsikolog,
          where : {
            UserId : req.user.id 
          }
        }, {
          model : CustomerBooking,
          include : [User]
        }],
        offset: req.query.page || 0, 
        limit: 4
      })
      res.status(200).json({status : true, result : data})
    } catch (error) {
      next(error)
    }
  }

  static async detailSchedule(req, res, next){ 
    try {
      const data = await SchedulePsikolog.findOne({
        where : {
          id : req.params.ScheduleId
        },
        include : [{
          model : ProfilePsikolog,
          where : {
            UserId : req.user.id 
          }
        }, {
          model : CustomerBooking,
          include : [User]
        }]
      })
      res.status(200).json({status : true, result : data})
    } catch (error) {
      next(error)
    }
  }
}