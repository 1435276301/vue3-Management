const express = require('express')
const cors = require('cors')
const router = require('./api/user')

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ limit: '100mb', extended: true }))

app.use(cors())
app.use(router)

// 使用中间件增加请求体的限制

app.listen(3030, () => {
  console.log('服务器启动成功')
})

module.exports = router
