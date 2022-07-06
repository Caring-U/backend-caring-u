const express = require('express')
const app = express()
const port = 3000
const allRouter = require('./routes/index')

app.use(express.urlencoded({extended : true}))
app.use(express.json())

app.use(allRouter)

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})