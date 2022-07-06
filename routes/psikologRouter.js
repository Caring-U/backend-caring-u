const router = require('express').Router()
const Controller = require('../controllers/PsikologController.js')

router.get('/', Controller.getAllSchedule)
router.get('/:ScheduleId', Controller.detailSchedule)

module.exports = router