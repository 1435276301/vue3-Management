const db = require('../db/index')
const router = require('../router')
// 添加用户
router.post('/addUser', (req, res) => {
  const sql = 'insert into user set ?'
  db.query(sql, req.body, (err, data) => {
    if (err) res.send({ code: 500, msg: err.message })
    else res.send({ code: 200, data, msg: '添加成功' })
  })
})
// 修改用户
router.post('/updateUser', (req, res) => {
  const sql = 'update user set ? where id = ?'
  db.query(sql, [req.body, req.body.id], (err, data) => {
    if (err) res.send({ code: 500, msg: err.message })
    else res.send({ code: 200, data, msg: '修改成功' })
  })
})

// 删除用户
router.delete('/deleteUser', (req, res) => {
  const sql = 'delete from user where id = ?'
  db.query(sql, req.body.id, (err, data) => {
    if (err) res.send({ code: 500, msg: err.message })
    else res.send({ code: 200, data, msg: '删除成功' })
  })
})
// 获取账号信息
router.get('/user', (req, res) => {
  const sql = 'select * from user'
  db.query(sql, (err, data) => {
    if (err) {
      res.send({ code: 500, msg: err.message })
    } else {
      res.send({ code: 200, data, msg: '查询成功' })
    }
  })
})
// 添加角色
router.post('/addRole', (req, res) => {
  if (req.body.id) {
    const sql = 'update role set role=?,`describe`=? where id = ?'
    db.query(sql, [req.body.role, req.body.describe, req.body.id], (err) => {
      if (err) throw err
      res.send({ code: 200, msg: '修改成功' })
    })
  } else {
    const sql = 'insert into role set role=?,`describe`=?'
    db.query(sql, [req.body.role, req.body.describe], (err, data) => {
      if (err) throw err
      res.send({ code: 200, data, msg: '添加角色成功' })
    })
  }
})

// 获取角色信息
router.get('/role', (req, res) => {
  const sql = 'select * from role'
  db.query(sql, (err, data) => {
    if (err) throw err
    res.send({ code: 200, data, msg: '获取角色信息成功' })
  })
})

// 删除角色
router.delete('/delRole', (req, res) => {
  const sql = 'delete from role where id = ?'
  db.query(sql, req.body.id, (err) => {
    if (err) throw err
    deletePermission(res, req.body.id)
  })
})
// 设置权限信息
router.post('/setAuth', async (req, res) => {
  const data = JSON.parse(JSON.stringify(req.body))
  const level1 = data['level1[]']
  const level2 = data['level2[]']
  const roleId = data.id

  if (level1 && level2) {
    const sql = 'select * from permission where roleId = ?'
    db.query(sql, data.id, (err, data) => {
      if (err) throw err
      if (data.length > 0) {
        const updateStatement = `UPDATE permission SET level1 = '${JSON.stringify(
          level1
        )}', level2 = '${JSON.stringify(level2)}' WHERE roleId = '${roleId}'`
        db.query(updateStatement, (err) => {
          if (err) throw err
          res.send({ code: 200, msg: '权限修改成功' })
        })
      } else {
        const insertStatement = `INSERT INTO permission (roleId, level1, level2) VALUES ('${roleId}', '${JSON.stringify(
          level1
        )}', '${JSON.stringify(level2)}');`

        db.query(insertStatement, (err) => {
          if (err) throw err
          res.send({ code: 200, msg: '权限添加成功' })
        })
      }
    })
  } else {
    deletePermission(res, roleId)
  }
})
// 权限删除回调函数
const deletePermission = (res, roleId) => {
  const deleteStatement = `DELETE FROM permission WHERE roleId = '${roleId}'`
  db.query(deleteStatement, (err) => {
    if (err) throw err
    res.send({ code: 200, msg: '权限删除成功' })
  })
}
// 获取默认权限
router.get('/defaultAuth', (req, res) => {
  const sql = 'select * from permission where roleId = ?'
  db.query(sql, req.query.id, (err, data) => {
    if (err) throw err
    res.send({ code: 200, data, msg: '获取默认权限成功' })
  })
})

// 获取商品分类
router.get('/goodsCategory', (req, res) => {
  const sql = 'select * from productcategory'
  db.query(sql, (err, data) => {
    if (err) throw err
    res.send({ code: 200, data, msg: '获取商品分类列表成功' })
  })
})

// 添加商品分类
router.post('/addGoodsCategory', (req, res) => {
  const sql = `INSERT INTO productcategory (categoryName) values (?)  `
  db.query(sql, req.body['data[data]'], (err) => {
    if (err) throw err
    res.send({ code: 200, msg: '添加商品分类成功' })
  })
})

// 删除商品分类
router.post('/deleteGoodsCategory', (req, res) => {
  const newData = JSON.parse(req.body.data)
  delete newData.id
  const sql = `update productcategory set categoryName = ? where id = ${
    JSON.parse(req.body.data).id
  }`
  db.query(sql, JSON.stringify(newData), (err) => {
    if (err) throw err
    res.send({ code: 200, msg: '修改商品分类成功' })
  })
})
// 删除一级分类
router.delete('/deleteGoodsCategoryOne', (req, res) => {
  const sql = `delete from productcategory where id = ${req.body.id}`
  db.query(sql, (err) => {
    if (err) throw err
    res.send({ code: 200, msg: '删除商品分类成功' })
  })
})

// 获取商品列表
router.get('/goodsList', (req, res) => {
  const sql = 'select * from goods'
  db.query(sql, (err, data) => {
    if (err) throw err
    res.send({ code: 200, data, msg: '获取商品列表成功' })
  })
})

// 添加商品
router.post('/addGoods', (req, res) => {
  const sql = `INSERT INTO goods set ?`
  db.query(sql, req.body, (err) => {
    if (err) throw err
    res.send({ code: 200, msg: '添加商品成功' })
  })
})

// 删除商品
router.delete('/deleteGoods', (req, res) => {
  const sql = `delete from goods where id = ${req.body.id}`
  db.query(sql, (err) => {
    if (err) throw err
    res.send({ code: 200, msg: '删除商品成功' })
  })
})

// 修改商品
router.post('/updateGoods', (req, res) => {
  const sql = `update goods set ? where id = ${req.body.id}`
  db.query(sql, req.body, (err) => {
    if (err) throw err
    res.send({ code: 200, msg: '修改商品成功' })
  })
})
module.exports = router
