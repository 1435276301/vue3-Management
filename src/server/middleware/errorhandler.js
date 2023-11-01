const jwt = require('jsonwebtoken')
const secret = 'ultraman' //解密密钥
function errorHandler(req, res, next) {
  let token = req.get('Authorization')
  if (!token) {
    return res.json({ msg: 'token不存在', code: 401 })
  }
  jwt.verify(token.split(' ')[1], secret, (err, decode) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.json({ msg: 'token过期', code: 401 })
      } else {
        return res.json({ msg: 'token无效', code: 401 })
      }
    }
    req.user = decode
    next()
  })
}

module.exports = errorHandler
