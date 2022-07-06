const router = require('express').Router()
const Controller = require('../controllers/PsikologController.js')
const {authentication, authorizeOwnerPsikolog} = require('../middlewares/auth')

router.get('/',authentication,  Controller.getAllSchedule)
router.get('/:ScheduleId', authentication,authorizeOwnerPsikolog, Controller.detailSchedule)

module.exports = router