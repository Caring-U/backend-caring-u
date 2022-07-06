require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const allRouter = require('./routes/index')

app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(cors())

app.use(allRouter)

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})