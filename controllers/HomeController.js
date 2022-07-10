const { axios } = require('axios')
const {ProfilePsikolog, SchedulePsikolog, CustomerBooking} = require('../models')

module.exports = class Controller {
  static async getAllPsikolog(req, res, next){
    try {
      const data = await ProfilePsikolog.findAndCountAll({
        offset: req.query.page || 0, //untuk pagination
        limit: 4, // tergantung tim FE mau berapa yang keluar
        attributes  : ["id","UserId","fullname", "imageUrl", "rating"]
      })
      res.status(200).json({status : true, result : data})
    } catch (error) {
      next(error)
    }
  }

  static async detailProfilePsikolog(req, res, next){
    try {
      const data = await ProfilePsikolog.findOne({
        where : {
          id : req.params.ProfilePsikologId
        },
        attributes : ["id","fullname", "imageUrl", "rating", "description"],
        include : [{
          model : SchedulePsikolog,
          attributes : {
            exclude : ["createdAt", "updatedAt"]
          }
        }]
      })
      res.status(200).json({status : true, result : data})
    } catch (error) {
      next(error)
    }
  }

  static async updatePaymentStatus(req, res, next){
    try {
      let paymentStatus
      let linkMeet
      if(req.body.transaction_status === "settlement" || req.body.transaction_status === "capture"){
        paymentStatus = "paid"
        //belum ada validasi expired dan jika belum waktunya meet maka tdk bisa membuka link meet
        let result = await axios({
          url : `https://ammin.metered.live/api/v1/room?secretKey=${process.env.SECRET_KEY_METERED}`,
          method : 'POST',
          data : {
            maxParticipants : 2
          }
        }
        )
        linkMeet = `https://ammin.metered.live/${result.data.roomName}`
      }else if(req.body.transaction_status === "deny" || req.body.transaction_status === "cancel" || req.body.transaction_status === "expire"){
        paymentStatus = "unpaid"
      }else{
        paymentStatus = "pending"
      }
      await CustomerBooking.update({paymentStatus, linkMeet}, {
        where : {
          orderIdMidtrans : req.body.order_id
        }
      })
      res.status(200).json({status : true, message : `success update orderId ${req.body.order_id}`})
    } catch (error) {
      next(error)
    }
  }
}