const common = require('../Common/query')
const bcrypt = require('bcryptjs');
var moment = require('moment'); // require


const query = common.query

module.exports.Login = async (req, res) => {
  try {
    let code = 404
    let name = null
    let id = null
    let token = null
    let message = "Login Failed, please check username or password again!"
    const { username, password } = req.body
    let sql = 'SELECT * FROM Users WHERE username=? AND password=?'
    let params = [username, password]
    const user = await query(sql, params)
    if (user.length > 0) {
      code = 200
      name = user[0].name,
      id = user[0].id,
      token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmIwODdlYjg2NTc1ODM1NThmODhlNTIiLCJpYXQiOjE2NTk0MzMzMjQsImV4cCI6MTY5MDk2OTMyNH0.5K8hBS6B31SZuuaQtjwTCWsorLq8vV4EpAvzZCtaq64"
      message = "Login successed"
    }
    let dataSend = {
      "code": code,
      "message": message,
      "data": {
        "id": id,
        "name": name,
        "username": username
      },
      "meta": {
        "token": token,
      }

    }
    res.status(200).send(dataSend)
  } catch (error) {
    console.log(error)
  }
}

module.exports.postAdd = async (req, res) => {
  try {
    let data = req.body
    let hash_password = await bcrypt.hash(req.body.password, 5)

    let sql = `INSERT INTO users (email, name, password, created_at) Values ( '${data.email}', '${data.name}', '${hash_password}', ${moment().unix()} )`
    //let sql = 'SELECT * FROM Metter'
    const devices = await query(sql)
    const dataSend = {
      code: 200,
      message: "OK",
      data: data
    }
    res.status(200).send(dataSend)
  } catch (error) {
    console.log(error)
  }
}

module.exports.getEdit = async (req, res) => {
  try {
    let id = req.query.id
    //let data = req.body
    let sql = `SELECT * FROM users where id = ${id}`
    //let sql = 'SELECT * FROM Metter'
    const devices = await query(sql)
    const dataSend = {
      code: 200,
      message: "OK",
      data: devices
    }
    res.status(200).send(dataSend)
  } catch (error) {
    console.log(error)
  }
}

module.exports.postEdit = async (req, res) => {
  try {
    let id = req.params.id
    let {name, username, password} = req.body
    let sql = ""
    sql = `UPDATE Users SET username = '${username}', name = '${name}' `
    if (password) {
      sql = sql + `, password = '${password}'`
    }
    sql = sql + ` where id = ${id}`
    const result = await query(sql)
    const dataSend = {
      code: 200,
      message: "Edit Account sucessfully!",
    }
    res.status(200).send(dataSend)
  } catch (error) {
    console.log(error)
  }
}

module.exports.delDelete = async (req, res) => {
  try {
    let id = req.query.id
    let sql = `DELETE FROM users where id = ${id}`

    const devices = await query(sql)
    const dataSend = {
      code: 200,
      message: "OK",
      data: devices
    }
    res.status(200).send(dataSend)
  } catch (error) {
    console.log(error)
  }
}