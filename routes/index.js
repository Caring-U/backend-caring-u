const router = require('express').Router()
const psiokologRouter = require('./psikologRouter.js')
const userRouter = require('./userRouter.js')

router.get('/', (req, res, next) => {
  res.status(200).json({
    status : true,
    message : 'Hello Caring-U'
  })
})

router.use('/psiokolog',psiokologRouter)
router.use('/users', userRouter)

module.exports = router