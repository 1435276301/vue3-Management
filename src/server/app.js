const express = require('express')
const cors = require('cors')
const router = require('./api/user')

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(router)
app.use(express.json())
app.listen(3030, () => {
  console.log('服务器启动成功')
})

module.exports = router
