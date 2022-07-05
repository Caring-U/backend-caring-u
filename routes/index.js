const res = require('express/lib/response')

const router = require('express').Router()

router.get('/', () => {
  res.status(200).json({
    status : true,
    message : 'Hello Caring-U'
  })
})

module.exports = router