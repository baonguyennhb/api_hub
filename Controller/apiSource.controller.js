const common = require('../Common/query')
const query = common.query
const { Telnet } = require('telnet-client')

module.exports.GetList = async (req, res) => {
    try {
        let sql = 'SELECT * FROM ApiSource'
        const apiSources = await query(sql)
        const dataSend = {
            code: 200,
            message: "OK",
            data: apiSources
        }
        res.status(200).send(dataSend)
    } catch (error) {
        console.log(error)
    }
}

module.exports.GetTestConnect = async (req, res) => {
  try {
    const connection = new Telnet()

    const params = {
      host: '14.225.244.63',
      port: 8083,
      shellPrompt: '/ # ', // or negotiationMandatory: false
      timeout: 1500
    }
  
    
      let rs = await connection.connect(params)
    
  
    //const res = await connection.exec(cmd)
    console.log('async result:', rs)

    
      let sql = 'SELECT * FROM DataSource'
      const apiSources = await query(sql)
      const dataSend = {
          code: 200,
          message: "OK",
          data: apiSources
      }
      res.status(200).send(dataSend)
  } catch (error) {
      console.log(error)
  }
}