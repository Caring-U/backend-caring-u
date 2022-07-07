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

  static async profilePsikolog(req, res, next){
    try {
      const data = await ProfilePsikolog.findOne({
        where : {
          UserId: req.user.id
        },
        include : [{
          model : SchedulePsikolog,
        }]
      })
      res.status(200).json({status : true, result : data})
    } catch (error) {
      next(error)
    }
  }

  static async createProfile(req, res, next) {
    try {
      const data = {
        UserId: req.user.id,
        fullname: req.body.fullname,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        rating: 0,
        certificate: req.body.certificate,
      }
      await ProfilePsikolog.create(data)
      res.status(201).json({status : true, message : "success create profile"})
    } catch (error) {
      next(error)
    }
  }

  static async createSchedule(req, res, next) {
    try {
      const data = {
        PsikologId: req.profilePsikolog.id,
        day: req.body.day,
        time: req.body.time,
      }
      await SchedulePsikolog.create(data)
      res.status(201).json({status : true, message : "success create schedule"})
    } catch (error) {
      next(error)
    }
  }
}