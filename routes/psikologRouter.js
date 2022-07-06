const router = require('express').Router()
const Controller = require('../controllers/PsikologController.js')
const {authentication} = require('../middlewares/auth')

router.get('/',authentication,  Controller.getAllSchedule)
router.get('/:ScheduleId', authentication, Controller.detailSchedule)

module.exports = router