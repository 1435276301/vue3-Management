const express = require('express')
const cors = require('cors')
const router = require('./api/user')

const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ limit: '100mb', extended: true }))
// 访问静态资源
app.use('/static', express.static('./static'))
app.use(router)

app.listen(3030, () => {
  console.log('服务器启动成功')
})

module.exports = router
