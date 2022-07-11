const { ProfilePsikolog } = require('../models')

class AdminController { 
    static async getAllPSikologStatus (req, res, next) {
        try {
            const data = await ProfilePsikolog.findAndCountAll({
              offset: req.query.page || 0,
              limit: 4,
              attributes  : ["id","UserId","fullname", "imageUrl", "rating", "status"]
            })
            res.status(200).json({status : true, result : data})
          } catch (error) {
            next(error)
          }
    }

    static updateStatusPsikolog (req, res, next) {
        const statusUpdate = ['Pending', 'Verify']
        const checkStatus = statusUpdate.some(el => el === req.body.status)
        if (checkStatus) {
            let psikolog
            ProfilePsikolog.update({
                status : req.body.status
            }, {
                where: {
                    id: req.params.PsikologId
                },
                returning : true
            })
            .then((data) => {
                // console.log(data[1], 'data');
                if (data[0] === 0) {
                    throw {
                        status: 404,
                        message: "Profile PSikolog not found"
                    }
                } else {
                    psikolog = data[1][0]
                }
            })
            .then((result) => {
                res.status(200).json(psikolog)
            })
            .catch((err) => {
                next(err)
            });
        }
    }

}

module.exports = AdminController
