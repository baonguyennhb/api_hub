const common = require('../Common/query')
const bcrypt = require('bcryptjs');
var moment = require('moment'); // require


const query = common.query

module.exports.Login = async (req, res) => {
    try {
        let sql = 'SELECT * FROM users'
        const user = await query(sql)
        const dataSend = {
            "code": 200,
            "message": "Login successed",
            "data": {
                "_id": "62b087eb8657583558f88e52",
                "name": "Nguyen Huu Bao",
                "email": "bao.nh@gmail.com",
            },
            "meta": {
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmIwODdlYjg2NTc1ODM1NThmODhlNTIiLCJpYXQiOjE2NTk0MzMzMjQsImV4cCI6MTY5MDk2OTMyNH0.5K8hBS6B31SZuuaQtjwTCWsorLq8vV4EpAvzZCtaq64",
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

      let sql = `INSERT INTO users (email, name, password, created_at) Values ( '${data.email}', '${data.name}', '${hash_password}', ${ moment().unix() } )`
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
      let id = req.query.id
      let data = req.body
      let sql = ""

      sql = `UPDATE users SET email = '${data.email}', name = '${data.name}' `
      if(data.password) {
        sql = sql + `password = '${data.password}'`
      }
      sql = sql + ` where id = ${id}`

                  
      const result = await query(sql)
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