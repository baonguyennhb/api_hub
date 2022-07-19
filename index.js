const express = require('express')
const axios = require('axios').default;
let xmlParser = require('xml2json');
const moment = require('moment')
const port = 4000

const app = express()

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

const mqtt = require('mqtt');
const { parseString } = require('xml2js');
var options = {
    port: 1883,
    username: 'Goy2waYPAGQP:n3Q78J2BBKeK',
    password: 'CVemCimzm0duGLr6OnvJ',
};

const client = mqtt.connect("mqtt://rabbitmq-001-pub.hz.wise-paas.com.cn:1883", options);

let dataConfig = {}

let dataConn = {}

let data = {}


const callAPI = async () => {
    let startOfDate = moment().startOf('day').format("YYYY-MM-DD HH:mm:ss")
    let params = {
        sNoList : 20698013,
        sTime : startOfDate
    }
    const response = await axios.get('http://14.225.244.63:8083/VendingInterface.asmx/SUNGRP_getInstant', {params})
    let xmlData = response.data
    let jsonData=xmlParser.toJson(xmlData)

    const valueData = JSON.parse(jsonData).DataTable['diffgr:diffgram'].DocumentElement.dtResult
    const lastIndex = valueData.length
    const lastData = valueData[lastIndex - 1]
    let dataJson = {
        madiemdo: parseFloat(lastData.MA_DIEMDO),
        socongto: parseFloat(lastData.SO_CTO),
        importkwh: parseFloat(lastData.IMPORT_KWH),
        exportkwh: parseFloat(lastData.EXPORT_KWH),
        importvar: parseFloat(lastData.IMPORT_VAR),
        exportvar: parseFloat(lastData.EXPORT_VAR),
        Ia: parseFloat(lastData.Ia),
        Ib: parseFloat(lastData.Ib),
        Ic: parseFloat(lastData.Ic),
        Ua: parseFloat(lastData.Ua),
        Ub: parseFloat(lastData.Ub),
        Uc: parseFloat(lastData.Uc),
        Cosphi: parseFloat(lastData.Cosphi),
        ngayGio: lastData.NGAYGIO
    }
   return dataJson
}

client.on("connect", ack => {
    console.log("MQTT Client Connected!")
    dataConn = { "d": { "scada_qQ2N60h1DmL": { "Con": 1 } }, "ts": Date.now() }
    dataConfig = {
        "d": {
            "scada_qQ2N60h1DmL": {
                "TID": 1,
                "Dsc": "descrp",
                "Hbt": 60,
                "PID": 1,
                "BID": 0,
                "UTg": {
                    "MA_DIEMDO": {
                        "Log": 1,
                        "SH": 1000,
                        "SL": 0,
                        "EU": "",
                        "DSF": "4.2",
                        "Alm": false,
                        "Name": "MA_DIEMDO",
                        "TID": 1,
                        "Dsc": "MA_DIEMDO",
                        "RO": 0,
                        "Ary": 1
                    },
                    "SO_CTO": {
                        "Log": 1,
                        "SH": 1000,
                        "SL": 0,
                        "EU": "",
                        "DSF": "4.2",
                        "Alm": false,
                        "Name": "SO_CTO",
                        "TID": 1,
                        "Dsc": "SO_CTO",
                        "RO": 0,
                        "Ary": 1
                    },
                    "IMPORT_KWH": {
                        "Log": 1,
                        "SH": 1000,
                        "SL": 0,
                        "EU": "",
                        "DSF": "4.2",
                        "Alm": false,
                        "Name": "IMPORT_KWH",
                        "TID": 1,
                        "Dsc": "IMPORT_KWH",
                        "RO": 0,
                        "Ary": 1
                    },
                    "EXPORT_KWH": {
                        "Log": 1,
                        "SH": 1000,
                        "SL": 0,
                        "EU": "",
                        "DSF": "4.2",
                        "Alm": false,
                        "Name": "EXPORT_KWH",
                        "TID": 1,
                        "Dsc": "EXPORT_KWH",
                        "RO": 0,
                        "Ary": 1
                    },
                    "IMPORT_VAR": {
                        "Log": 1,
                        "SH": 1000,
                        "SL": 0,
                        "EU": "",
                        "DSF": "4.2",
                        "Alm": false,
                        "Name": "IMPORT_VAR",
                        "TID": 1,
                        "Dsc": "IMPORT_VAR",
                        "RO": 0,
                        "Ary": 1
                    },
                    "EXPORT_VAR": {
                        "Log": 1,
                        "SH": 1000,
                        "SL": 0,
                        "EU": "",
                        "DSF": "4.2",
                        "Alm": false,
                        "Name": "EXPORT_VAR",
                        "TID": 1,
                        "Dsc": "EXPORT_VAR",
                        "RO": 0,
                        "Ary": 1
                    },
                    "Ia": {
                        "Log": 1,
                        "SH": 1000,
                        "SL": 0,
                        "EU": "",
                        "DSF": "4.2",
                        "Alm": false,
                        "Name": "Ia",
                        "TID": 1,
                        "Dsc": "Ia",
                        "RO": 0,
                        "Ary": 1
                    },
                    "Ib": {
                        "Log": 1,
                        "SH": 1000,
                        "SL": 0,
                        "EU": "",
                        "DSF": "4.2",
                        "Alm": false,
                        "Name": "Ib",
                        "TID": 1,
                        "Dsc": "Ib",
                        "RO": 0,
                        "Ary": 1
                    },
                    "Ic": {
                        "Log": 1,
                        "SH": 1000,
                        "SL": 0,
                        "EU": "",
                        "DSF": "4.2",
                        "Alm": false,
                        "Name": "Ic",
                        "TID": 1,
                        "Dsc": "Ic",
                        "RO": 0,
                        "Ary": 1
                    },
                    "Ua": {
                        "Log": 1,
                        "SH": 1000,
                        "SL": 0,
                        "EU": "",
                        "DSF": "4.2",
                        "Alm": false,
                        "Name": "Ua",
                        "TID": 1,
                        "Dsc": "Ua",
                        "RO": 0,
                        "Ary": 1
                    },
                    "Ub": {
                        "Log": 1,
                        "SH": 1000,
                        "SL": 0,
                        "EU": "",
                        "DSF": "4.2",
                        "Alm": false,
                        "Name": "Ub",
                        "TID": 1,
                        "Dsc": "Ub",
                        "RO": 0,
                        "Ary": 1
                    },
                    "Uc": {
                        "Log": 1,
                        "SH": 1000,
                        "SL": 0,
                        "EU": "",
                        "DSF": "4.2",
                        "Alm": false,
                        "Name": "Uc",
                        "TID": 1,
                        "Dsc": "Uc",
                        "RO": 0,
                        "Ary": 1
                    },
                    "Cosphi": {
                        "Log": 1,
                        "SH": 1000,
                        "SL": 0,
                        "EU": "",
                        "DSF": "4.2",
                        "Alm": false,
                        "Name": "Cosphi",
                        "TID": 1,
                        "Dsc": "Cosphi",
                        "RO": 0,
                        "Ary": 1
                    },
                    "NGAYGIO": {
                        "Name": "NGAYGIO",
                        "TID": 3,
                        "Dsc": "NGAYGIO",
                        "RO": 0,
                        "Ary": 1
                    }
                }
            }
        },
        "ts": Date.now()
    }
    client.publish('iot-2/evt/waconn/fmt/scada_qQ2N60h1DmL', JSON.stringify(dataConn))
    console.log("success connect!")
    client.publish('iot-2/evt/wacfg/fmt/scada_qQ2N60h1DmL', JSON.stringify(dataConfig))
    //console.log("success config tag!")
    setInterval(async () => {
        // Call API 
        const { madiemdo, socongto, importkwh, exportkwh, importvar, exportvar, Ia, Ib, Ic, Ua, Ub, Uc, Cosphi, ngayGio } = await callAPI()
        // Data
        data = {
            "d": {
                "scada_qQ2N60h1DmL": {
                    "Val": {
                        "MA_DIEMDO": madiemdo,
                        "SO_CTO": socongto,
                        "IMPORT_KWH": importkwh,
                        "EXPORT_KWH": exportkwh,
                        "IMPORT_VAR": importvar,
                        "EXPORT_VAR": exportvar,
                        "Ia": Ia,
                        "Ib": Ib,
                        "Ic": Ic,
                        "Ua": Ua,
                        "Ub": Ub,
                        "Uc": Uc,
                        "Cosphi": Cosphi,
                        "NGAYGIO": ngayGio
                    }
                }
            },
            "ts": Date.now()
        }
        client.publish('iot-2/evt/wacfg/fmt/scada_qQ2N60h1DmL', JSON.stringify(dataConfig))
        client.publish('iot-2/evt/wadata/fmt/scada_qQ2N60h1DmL', JSON.stringify(data))
        console.log("Send Data")
    }, 15000)
})

app.get('/', async (req, res) => {
    let startOfDate = moment().startOf('day').format("YYYY-MM-DD HH:mm:ss")
    let params = {
        sNoList : 20698013,
        sTime : startOfDate
    }
    const response = await axios.get('http://14.225.244.63:8083/VendingInterface.asmx/SUNGRP_getInstant', {params})
    let xmlData = response.data
    let jsonData=xmlParser.toJson(xmlData)

    const valueData = JSON.parse(jsonData).DataTable['diffgr:diffgram'].DocumentElement.dtResult
    const lastIndex = valueData.length
    const lastData = valueData[lastIndex - 1]
    let dataJson = {
        madiemdo: parseFloat(lastData.MA_DIEMDO),
        socongto: parseFloat(lastData.SO_CTO),
        importkwh: parseFloat(lastData.IMPORT_KWH),
        exportkwh: parseFloat(lastData.EXPORT_KWH),
        importvar: parseFloat(lastData.IMPORT_VAR),
        exportvar: parseFloat(lastData.EXPORT_VAR),
        Ia: parseFloat(lastData.Ia),
        Ib: parseFloat(lastData.Ib),
        Ic: parseFloat(lastData.Ic),
        Ua: parseFloat(lastData.Ua),
        Ub: parseFloat(lastData.Ub),
        Uc: parseFloat(lastData.Uc),
        Cosphi: parseFloat(lastData.Cosphi),
        ngayGio: lastData.NGAYGIO
    }
   res.send(dataJson)
})


