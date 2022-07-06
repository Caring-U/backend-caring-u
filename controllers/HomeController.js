const {ProfilePsikolog} = require('../models')

module.exports = class Controller {
    static async getAllPsikolog(req, res, next){
    try {
      const data = await ProfilePsikolog.findAndCountAll({
        offset: req.query.page || 0, //untuk pagination
        limit: 4 // tergantung tim FE mau berapa yang keluar
      })
      res.status(200).json({status : true, result : data})
    } catch (error) {
      next(error)
    }
  }
}