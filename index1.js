const express = require('express')
const group = require('express-group-routes')
var cors = require('cors')
const axios = require('axios').default;
let xmlParser = require('xml2json');
const moment = require('moment')
var bodyParser = require('body-parser')
const common = require('./Common/query')
const query = common.query
const mqtt = require('mqtt');
const CronJob = require('cron').CronJob;


const port = 4000

const app = express()
app.use(cors())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

// Variable

const groupId = 'scada_5dAWAnEpGXe'
const mqttUrl = "mqtt://rabbitmq-001-pub.hz.wise-paas.com.cn:1883"
const mqttTopicConn = `iot-2/evt/waconn/fmt/${groupId}`
const mqttTopicCfg = `iot-2/evt/wacfg/fmt/${groupId}`
const mqttTopicSendata = `iot-2/evt/wadata/fmt/${groupId}`
const HbtInterval = 5

var options = {
  port: 1883,
  username: 'Goy2waYPAGQP:d1ejmm44L8QV',
  password: 'uOh4z8bvRPyIVHBlIiXI',
};

// Connect MQTT Broker 

let client

// Handle Connect MQTT and Push data

const ConnectionMessage = require("./EdgeSdk/ConnectionMessage")
const HeartBeatMessage = require("./EdgeSdk/HeartBeatMessage")
const ConfigTagMessage = require("./EdgeSdk/ConfigTagMesage")
const DeleteTagConfigMessage = require("./EdgeSdk/DeleteTagMessage")

//=================================================
// Init
async function Init() {
  let config = await query(`SELECT * FROM DataHub`)
  let options = {
    port: 1883,
    username: config[0].username, //     'Goy2waYPAGQP:n3Q78J2BBKeK',
    password: config[0].password, //    'CVemCimzm0duGLr6OnvJ',
    reconnectPeriod: 2000,
    connectTimeout: 5000
  };

  groupId = config[0].group_id //'scada_qQ2N60h1DmL'
  mqttUrl = "mqtt://" + config[0].host + ":" + config[0].port
  mqttTopicConn = `iot-2/evt/waconn/fmt/${groupId}`
  mqttTopicCfg = `iot-2/evt/wacfg/fmt/${groupId}`
  mqttTopicSendata = `iot-2/evt/wadata/fmt/${groupId}`
  HbtInterval = config[0].heart_beat

  client = mqtt.connect(mqttUrl, options);

  console.log(options, config[0])

  client.on("connect", ack => {
    try {
      console.log("MQTT Client Connected!")
      const _connectionMessage = ConnectionMessage(groupId)
      client.publish(mqttTopicConn, JSON.stringify(_connectionMessage), { qos: 1, retain: false })
      console.log("Connect success!")
      setInterval(sendHeartBeatMessage, HbtInterval * 1000)
      // Send Tag Config
      sendTagConfigMessage()
      console.log(" Config tag success!")
      console.log("Connected")
    } catch (error) {
      console.log(error)
    }
  })
  //==================================================
  client.on("reconnect", ack => {
    try {
      console.log("MQTT Reconnect Connected!")

    } catch (error) {
      console.log(error)
    }
  })
  client.on("error", async function (ack) {
    try {
      console.log("MQTT Error!", ack.message)

      let config = await query(`SELECT * FROM DataHub`)
      let options = {
        port: 1883,
        username: config[0].username, //     'Goy2waYPAGQP:n3Q78J2BBKeK',
        password: config[0].password, //    'CVemCimzm0duGLr6OnvJ',
        reconnectPeriod: 2000,
        connectTimeout: 1000
      };

      groupId = config[0].group_id //'scada_qQ2N60h1DmL'
      mqttUrl = "mqtt://" + config[0].host + ":" + config[0].port
      mqttTopicConn = `iot-2/evt/waconn/fmt/${groupId}`
      mqttTopicCfg = `iot-2/evt/wacfg/fmt/${groupId}`
      mqttTopicSendata = `iot-2/evt/wadata/fmt/${groupId}`
      HbtInterval = config[0].heart_beat

      await delay(2000)
      client.reconnect(mqttUrl, options)

    } catch (error) {
      console.log(error)
    }
  })
  client.on("close", ack => {
    try {
      console.log("MQTT close!", ack.message)

    } catch (error) {
      console.log(error)
    }
  })
  client.on("disconnect", ack => {
    try {
      console.log("MQTT disconnect!", ack.message)

    } catch (error) {
      console.log(error)
    }
  })
  client.on("offline", ack => {
    try {
      console.log("MQTT offline!", ack.message)

    } catch (error) {
      console.log(error)
    }
  })
  //==================================================


}

Init()


async function getDataHubConfig() {
  let sql = "SELECT * FROM DataHub"
  const data_hub_cgf = await query(sql)
  return data_hub_cgf[0]
}

const sendHeartBeatMessage = () => {
  const _messageHeartBeat = HeartBeatMessage(groupId)
  const topic = mqttTopicConn
  client.publish(topic, JSON.stringify(_messageHeartBeat), { qos: 1, retain: false });
}

const sendTagConfigMessage = async () => {
  const data_hub_cgf = await getDataHubConfig()
  const groupId = data_hub_cgf.group_id
  const allTag = await getMqttTag()
  const _messageConfigTag = ConfigTagMessage(groupId, allTag)
  const topic = mqttTopicCfg
  client.publish(topic, JSON.stringify(_messageConfigTag), { qos: 1, retain: false });
}

const SendDeleteConfigTag = async (tag, groupId, heatbeat) => {
  const _messageDeleteConfigTag = DeleteTagConfigMessage.DeleteTag(tag, groupId, heatbeat)
  console.log("Delete!")
  console.log(_messageDeleteConfigTag)
  const topic = mqttTopicCfg
  client.publish(topic, JSON.stringify(_messageDeleteConfigTag), { qos: 1, retain: false });
}

const getMqttTag = async () => {
  let sql = "SELECT * FROM MqttTag"
  const allTag = await query(sql)
  return allTag
}

// Handle Call API with 1 api source
async function callAPI(api_source, start) {
  try {
    let startOfDate = moment(start).startOf('day').format("YYYY-MM-DD HH:mm:ss")
    let params
    let sNoList = await api_source.metters.map(metter => metter.serial)
    let d = {}
    params = {
      sNoList: sNoList.toString(), // 20697927, //sNoList,  //20698013,20697912
      sTime: startOfDate     // startOfDate
    }
    const response = await axios.get(api_source.url, { params })
    let xmlData = response.data
    let jsonData = xmlParser.toJson(xmlData)
    const valueData = JSON.parse(jsonData).DataTable['diffgr:diffgram'].DocumentElement?.dtResult
    return {
      data: valueData,
      ts: moment().format("YYYY-MM-DD HH:mm:ss")
    }
  } catch (error) {

  }
}

//=================================================
// Read Metter as interval

async function ReadMetter() {
  try {

    var nextExecutionTime = await getMetterInterval();
    let api_sources = await getApiSource()

    let start = moment().startOf('days')
    if (moment().hour() <= 0) {
      start = moment().subtract(2, 'hours').startOf('days')
    }
    console.log(start)


    //====> Update LastValue in Tag Table

    let sql = "SELECT * " +
      "FROM ApiSource " +
      "LEFT JOIN Metter " +
      "ON ApiSource.id = Metter.api_source " +
      "LEFT JOIN Tag " +
      "ON Tag.metter_id = Metter.metter_id"

    const allTags = await query(sql)

    let dataOfAllApiSource = {}
    for (let i = 0; i < api_sources.length; i++) {
      const api_source = api_sources[i];
      dataOfAllApiSource[`${api_source.connection_name}`] = await callAPI(api_source, start)
    }

    for (let i = 0; i < allTags.length; i++) {
      if (allTags[i].connection_name && allTags[i].metter_id && allTags[i].parameter) {
        let apiSource = allTags[i].connection_name
        let apiSourceId = allTags[i].api_source
        let serialMetter = allTags[i].serial
        let parameterTag = allTags[i].parameter
        let dataType = allTags[i].data_type
        let scale = allTags[i].scale
        let metterId = allTags[i].metter_id
        let filterDataBySerial = dataOfAllApiSource[`${apiSource}`].data?.filter(value => value.SO_CTO === serialMetter.toString())
        let timestamp = dataOfAllApiSource[`${apiSource}`].ts
        let tagData = filterDataBySerial.length ? filterDataBySerial[filterDataBySerial.length - 1][`${parameterTag}`] : undefined
        if (tagData !== undefined) {
          //console.log(tagData)
          let dataByScale
          if (dataType === "Number") {
            dataByScale = tagData * scale
          } else {
            dataByScale = tagData
          }
          let sqlUpdateValue = `UPDATE Tag SET last_value = '${dataByScale}', timestamp = '${timestamp}' where api_source = '${apiSourceId}' AND metter_id = '${metterId}' AND parameter= '${parameterTag}'`
          const updated = await query(sqlUpdateValue)
        }
      }
    }
    //=====> Update Last Value in Tag Table

    //=====> Insert Raw Data

    for (let i = 0; i < api_sources.length; i++) {

      const api_source = api_sources[i];

      let all_tags = await getTagInRawNeedupdate(api_source.id, start)
      let data_sources = await callAPI(api_source, start)

      //console.log('All_tags', all_tags.length)
      if (all_tags) {
        for (let j = 0; j < all_tags.length; j++) {
          const tag = all_tags[j];
          //console.log(tag)
          const result = data_sources.data.find(({ NGAYGIO, SO_CTO }) => NGAYGIO === tag.timestamp.toString() && SO_CTO == tag.serial.toString());

          let _tag = await query(`SELECT * From Tag where metter_id = '${tag.metter_id}' and parameter = '${tag.param}'`)

          if (result) {
            //console.log('---> tag', _tag[0].data_type, result[tag.param], _tag[0].scale)
            let _value = _tag[0]?.data_type == "Number" ? parseFloat(result[tag.param]) * parseFloat(_tag[0].scale) : result[tag.param]
            let rs = await query(`UPDATE RawData SET value = '${_value}', is_had_data = 1 WHERE id = ${tag.id}`);
          }

        }
      }
    }
    //=====> Insert Raw Data
    console.log("---> Read Data OK", moment().format('HH:mm:ss'))

    setTimeout(ReadMetter, nextExecutionTime);
  }
  catch (error) {
    console.log(error)
  }
}

ReadMetter()



async function getMetterInterval() {
  try {
    let sql = 'SELECT * FROM ApiSource'
    const result = await query(sql)
    return result[0].interval * 1000
  } catch (error) {
    console.log(error)
  }

}

async function getApiSource() {
  try {
    let sql = 'SELECT * FROM ApiSource where is_active = 1'
    const api_sources = await query(sql)
    for (let i = 0; i < api_sources.length; i++) {
      const api_source = api_sources[i];
      let metters = await query(`SELECT * FROM Metter where api_source = ${api_source.id}`)
      let tags = []
      for (let j = 0; j < metters.length; j++) {
        const metter = metters[j];
        let tags = await query(`SELECT * FROM Tag where metter_id = '${metter.metter_id}'`)
        metters[j].tags = tags
      }
      api_sources[i].metters = metters
    }
    return api_sources
  } catch (error) {
    console.log(error)
  }
}

async function setTagInRawData() {
  try {
    let start = moment().startOf('day')

    let sql = `SELECT Tag.id as TagId, * FROM Tag 
                JOIN Metter on Metter.metter_id = Tag.metter_id and Metter.api_source = Tag.api_source
              `
    const tags = await query(sql)

    //console.log('tags', tags)

    for (let i = 0; i < 48; i++) {
      timestamp_str = start.format('YYYY-MM-DD HH:mm:ss')
      await tags.forEach(async e => {
        let sql2 = `INSERT INTO RawData (timestamp, api_source, tag_id, metter_id, serial, param) Values ( '${timestamp_str}', ${e.api_source}, ${e.TagId}, '${e.metter_id}', ${e.serial}, '${e.parameter}' )`
        try {
          await query(sql2)
        } catch (error) {
          //console.log(error.message)
        }

      });

      start = moment(start).add(30, 'minutes')
      //console.log(metter_tags)
    }

  } catch (e) {
    console.log(e.message)
  }



  //let sql = 'SELECT * FROM Metter'


  //return 
}

async function getTagInRawNeedupdate(api_source, start1) {
  try {
    let start = moment(start1).format('YYYY-MM-DD HH:mm:ss')
    let end = moment().format('YYYY-MM-DD HH:mm:ss')
    let sql = `SELECT DISTINCT timestamp, serial, param, id, metter_id  FROM RawData WHERE timestamp BETWEEN '${start}' AND '${end}' and is_had_data = 0 and api_source = ${api_source}`
    const tags = await query(sql)
    return tags
  } catch (error) {
    console.log(error)
  }
}

//============================================================

const deviceRouter = require('./Routes/device.route')
const tagRouter = require('./Routes/tag.route')
const deviceTagRouter = require('./Routes/device_tag.route')
const userRouter = require('./Routes/user.route')
const apiSourceRouter = require('./Routes/apiSource.route');
const dataHubRouter = require('./Routes/dataHub.route');

const { stat } = require('fs');
const delay = require('delay');

app.group('/api/v1', (router) => {
  router.use('/user', userRouter)
  router.use('/api-source', apiSourceRouter)
  router.use('/device', deviceRouter)
  router.use('/tag', tagRouter)
  router.use('/device_tag', deviceTagRouter)
  router.use('/data-hub', dataHubRouter)
})

// Delete Tag Mqtt

app.delete('/api/v1/data-hub/remove/tag', (req, res) => {
  DeleteMqttTag(req, res)
})

const DeleteMqttTag = async (req, res) => {
  try {
    let id = req.query.id

    let tagDelete = await query(`SELECT * FROM MqttTag where id = ${id}`)

    SendDeleteConfigTag(tagDelete[0], groupId, 5)

    let sql = `DELETE FROM MqttTag where id = ${id}`

    const mqttTag = await query(sql)

    const dataSend = {
      code: 200,
      message: "OK",
      data: mqttTag
    }
    res.status(200).send(dataSend)
  } catch (error) {
    console.log(error)
  }
}

app.get("/api/v1/data-hub/upload-config", async (req, res) => {
  try {
    await sendTagConfigMessage()
    const dataSend = {
      "code": 200,
      "message": "OK",
      "data": "Config tag successfully!"
    }
    res.status(200).send(dataSend)
  } catch (error) {
    console.log(error)
  }
})

//================================================================
// Run job every 0h5 am everyday
var job0h5 = new CronJob('5 0 * * *', async function () {
  await setTagInRawData()
}, null, true, 'Asia/Ho_Chi_Minh');

job0h5.start()
setTagInRawData()

//================================================================
// Check Status API SOURCE

//================================================================




