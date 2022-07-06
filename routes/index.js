const router = require('express').Router()
const psiokologRouter = require('./psikologRouter.js')
const HomeController = require('../controllers/HomeController.js')
const userRouter = require('./userRouter.js')

router.get('/', (req, res, next) => {
  res.status(200).json({
    status : true,
    message : 'Hello Caring-U'
  })
})

//untuk halaman utama
router.get('/list-psikolog', HomeController.getAllPsikolog)


//untuk dashboard psikolog (setelah login)
router.use('/psikolog',psiokologRouter)

//untuk auth
router.use('/users', userRouter)

module.exports = router