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

// Variable

const groupId = 'scada_UzVa32VanG4I'
const mqttUrl = "mqtt://10.129.167.251:1883"
const mqttTopicConn = `iot-2/evt/waconn/fmt/${groupId}`
const mqttTopicCfg = `iot-2/evt/wacfg/fmt/${groupId}`
const mqttTopicSendata = `iot-2/evt/wadata/fmt/${groupId}`

var options = {
    port: 1883,
    username: 'Bbql3pmm5weM:dgqMkW08KwQb',
    password: 'FFchKM7La1sHs2QsRzzu',
};
// Connect MQTT Broker 

const client = mqtt.connect(mqttUrl, options);


// Handle Call API

const callAPI = async () => {
    let d = {}
    let startOfDate = moment().startOf('day').format("YYYY-MM-DD HH:mm:ss")
    let params = {
        sNoList: "20698013,20697912,20697917,20697923,20697924,20697927,20697996,20697875,20697666,20697578,20697586,20697594",
        sTime: startOfDate
    }
    const response = await axios.get('http://14.225.244.63:8083/VendingInterface.asmx/SUNGRP_getInstant', { params })
    let xmlData = response.data
    let jsonData = xmlParser.toJson(xmlData)
    const valueData = JSON.parse(jsonData).DataTable['diffgr:diffgram'].DocumentElement?.dtResult
    const listModel = [20698013, 20697912, 20697917, 20697923, 20697924, 20697927, 20697996, 20697875, 20697666, 20697578, 20697586, 20697594]
    let Val = {}
    for (let i = 0; i < listModel.length; i++) {
        const dataObjectFilterByModel = valueData ? valueData.filter(value => value.MA_DIEMDO === listModel[i].toString()) : []
        const dataObject = dataObjectFilterByModel[dataObjectFilterByModel.length - 1]
        Val[`${listModel[i]}:MA_DIEMDO`] = valueData ? parseFloat(dataObject?.MA_DIEMDO) : null
        Val[`${listModel[i]}:SO_CTO`] = valueData ? parseFloat(dataObject?.SO_CTO) : null
        Val[`${listModel[i]}:IMPORT_KWH`] = valueData ? parseFloat(dataObject?.IMPORT_KWH) : null
        Val[`${listModel[i]}:EXPORT_KWH`] = valueData ? parseFloat(dataObject?.EXPORT_KWH) : null
        Val[`${listModel[i]}:IMPORT_VAR`] = valueData ? parseFloat(dataObject?.IMPORT_VAR) : null
        Val[`${listModel[i]}:EXPORT_VAR`] = valueData ? parseFloat(dataObject?.EXPORT_VAR) : null
        Val[`${listModel[i]}:Ia`] = valueData ? parseFloat(dataObject?.Ia) : null
        Val[`${listModel[i]}:Ib`] = valueData ? parseFloat(dataObject?.Ib) : null
        Val[`${listModel[i]}:Ic`] = valueData ? parseFloat(dataObject?.Ic) : null
        Val[`${listModel[i]}:Ua`] = valueData ? parseFloat(dataObject?.Ua) : null
        Val[`${listModel[i]}:Ub`] = valueData ? parseFloat(dataObject?.Ub) : null
        Val[`${listModel[i]}:Uc`] = valueData ? parseFloat(dataObject?.Uc) : null
        Val[`${listModel[i]}:Cosphi`] = valueData ? parseFloat(dataObject?.Cosphi) : null
        Val[`${listModel[i]}:NGAYGIO`] = valueData ? dataObject?.NGAYGIO : null
    }
    d[`${groupId}`] = {
        "Val": Val
    }
    const data = {
        "d": d,
        "ts": Date.now()
    }
    return data
}

// Handle Connect MQTT and Push data

client.on("connect", ack => {
    try {
        console.log("MQTT Client Connected!")
        const dataConn = connectJson()
        const dataConfig = updateTag()
        client.publish(mqttTopicConn, JSON.stringify(dataConn))
        console.log(" Connect success!")
        // client.publish(mqttTopicCfg, JSON.stringify(dataConfig))
        // console.log(" Config tag success!")
        // setInterval(async () => {
        //     //const data = await callAPI()
        client.publish(mqttTopicCfg, JSON.stringify(deleteTag()))
        //     console.log("Send Data")
        // }, 10 * 1000)
    } catch (error) {
        console.log(error)
    }

})

const connectJson = () => {
    let d = {}
    d[`${groupId}`] = { "Con": 1 }
    const dataConn = {
        "d": d,
        "ts": Date.now()
    }
    return dataConn
}


const updateTag = () => {
    let d = {}
    const listModel = [20698013, 20697912, 20697917, 20697923, 20697924, 20697927, 20697996, 20697875, 20697666, 20697578, 20697586, 20697594]
    let Utg = {}
    for (let i = 0; i < listModel.length; i++) {
        Utg[`${listModel[i]}:MA_DIEMDO`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:MA_DIEMDO`,
            "TID": 1,
            "Dsc": "MA_DIEMDO",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:SO_CTO`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:SO_CTO`,
            "TID": 1,
            "Dsc": "SO_CTO",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:IMPORT_KWH`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:IMPORT_KWH`,
            "TID": 1,
            "Dsc": "IMPORT_KWH",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:EXPORT_KWH`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:EXPORT_KWH`,
            "TID": 1,
            "Dsc": "EXPORT_KWH",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:IMPORT_VAR`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:IMPORT_VAR`,
            "TID": 1,
            "Dsc": "IMPORT_VAR",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:EXPORT_VAR`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:EXPORT_VAR`,
            "TID": 1,
            "Dsc": "EXPORT_VAR",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:Ia`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:Ia`,
            "TID": 1,
            "Dsc": "Ia",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:Ib`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:Ib`,
            "TID": 1,
            "Dsc": "Ib",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:Ic`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:Ic`,
            "TID": 1,
            "Dsc": "Ic",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:Ua`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:Ua`,
            "TID": 1,
            "Dsc": "Ua",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:Ub`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:Ub`,
            "TID": 1,
            "Dsc": "Ub",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:Uc`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:Uc`,
            "TID": 1,
            "Dsc": "Uc",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:Cosphi`] = {
            "Log": 1,
            "SH": 1000,
            "SL": 0,
            "EU": "",
            "DSF": "4.2",
            "Alm": false,
            "Name": `${listModel[i]}:Cosphi`,
            "TID": 1,
            "Dsc": "Cosphi",
            "RO": 0,
            "Ary": 1
        }
        Utg[`${listModel[i]}:NGAYGIO`] = {
            "Name": `${listModel[i]}:NGAYGIO`,
            "TID": 3,
            "Dsc": "NGAYGIO",
            "RO": 0,
            "Ary": 1
        }

        //UpdateTagList.push(UpdateTag)
    }
    d[`${groupId}`] = {
        "TID": 1,
        "Dsc": "descrp",
        "Hbt": 60,
        "PID": 1,
        "BID": 0,
        "UTg": Utg
    }
    const dataConfig = {
        "d": d,
        "ts": Date.now()
    }
    return dataConfig
}

const deleteTag = () => {
    let d = {}
    const listModel = [20698013, 20697912, 20697917, 20697923, 20697924, 20697927, 20697996, 20697875, 20697666, 20697578, 20697586, 20697594]
    let DTg = {}
    for (let i = 0; i < listModel.length; i++) {
        DTg[`${listModel[i]}:MA_DIEMDO`] = 1
        DTg[`${listModel[i]}:SO_CTO`] = 1
        DTg[`${listModel[i]}:IMPORT_KWH`] = 1
        DTg[`${listModel[i]}:EXPORT_KWH`] = 1
        DTg[`${listModel[i]}:IMPORT_VAR`] = 1
        DTg[`${listModel[i]}:EXPORT_VAR`] = 1
        DTg[`${listModel[i]}:Ia`] = 1
        DTg[`${listModel[i]}:Ib`] = 1
        DTg[`${listModel[i]}:Ic`] = 1
        DTg[`${listModel[i]}:Ua`] = 1
        DTg[`${listModel[i]}:Ub`] = 1
        DTg[`${listModel[i]}:Uc`] = 1
        DTg[`${listModel[i]}:Cosphi`] = 1
        DTg[`${listModel[i]}:NGAYGIO`] = 1
        //UpdateTagList.push(UpdateTag)
    }
    d[`${groupId}`] = {
        "TID": 1,
        "Dsc": "descrp",
        "Hbt": 60,
        "PID": 1,
        "BID": 0,
        "DTg": {
            "20698013:MA_DIEMDO": 1,
            "20698013:SO_CTO": 1,
            "20698013:IMPORT_KWH": 1,
            "20698013:EXPORT_KWH": 1,
            "20698013:IMPORT_VAR": 1,
            "20698013:EXPORT_VAR": 1,
            "20698013:Ia": 1,
            "20698013:Ib": 1,
            "20698013:Ic": 1,
            "20698013:Ua": 1,
            "20698013:Ub": 1,
            "20698013:Uc": 1,
            "20698013:Cosphi": 1,
            "20698013:NGAYGIO": 1,
        },
        "Del": 1
    }
    const dataConfig = {
        "d": d,
        "ts": Date.now()
    }
    return dataConfig
}

// API TESTING

app.get('/cfg', async (req, res) => {
    res.send(updateTag())
})

app.get('/data', async (req, res) => {
    let startOfDate = moment().startOf('day').format("YYYY-MM-DD HH:mm:ss")
    let params = {
        sNoList: "20698013,20697912,20697917,20697923,20697924,20697927,20697996,20697875,20697666,20697578,20697586,20697594",
        sTime: startOfDate
    }
    const response = await axios.get('http://14.225.244.63:8083/VendingInterface.asmx/SUNGRP_getInstant', { params })
    let xmlData = response.data
    let jsonData = xmlParser.toJson(xmlData)
    const valueData = JSON.parse(jsonData).DataTable['diffgr:diffgram'].DocumentElement?.dtResult
    console.log(valueData)
    const listModel = [20698013, 20697912, 20697917, 20697923, 20697924, 20697927, 20697996, 20697875, 20697666, 20697578, 20697586, 20697594]
    let Val = {}
    for (let i = 0; i < listModel.length; i++) {
        const dataObjectFilterByModel = valueData ? valueData.filter(value => value.MA_DIEMDO === listModel[i].toString()) : []
        const dataObject = dataObjectFilterByModel[dataObjectFilterByModel.length - 1]
        Val[`${listModel[i]}:MA_DIEMDO`] = valueData ? parseFloat(dataObject?.MA_DIEMDO) : null
        Val[`${listModel[i]}:SO_CTO`] = valueData ? parseFloat(dataObject?.SO_CTO) : null
        Val[`${listModel[i]}:IMPORT_KWH`] = valueData ? parseFloat(dataObject?.IMPORT_KWH) : null
        Val[`${listModel[i]}:EXPORT_KWH`] = valueData ? parseFloat(dataObject?.EXPORT_KWH) : null
        Val[`${listModel[i]}:IMPORT_VAR`] = valueData ? parseFloat(dataObject?.IMPORT_VAR) : null
        Val[`${listModel[i]}:EXPORT_VAR`] = valueData ? parseFloat(dataObject?.EXPORT_VAR) : null
        Val[`${listModel[i]}:Ia`] = valueData ? parseFloat(dataObject?.Ia) : null
        Val[`${listModel[i]}:Ib`] = valueData ? parseFloat(dataObject?.Ib) : null
        Val[`${listModel[i]}:Ic`] = valueData ? parseFloat(dataObject?.Ic) : null
        Val[`${listModel[i]}:Ua`] = valueData ? parseFloat(dataObject?.Ua) : null
        Val[`${listModel[i]}:Ub`] = valueData ? parseFloat(dataObject?.Ub) : null
        Val[`${listModel[i]}:Uc`] = valueData ? parseFloat(dataObject?.Uc) : null
        Val[`${listModel[i]}:Cosphi`] = valueData ? parseFloat(dataObject?.Cosphi) : null
        Val[`${listModel[i]}:NGAYGIO`] = valueData ? dataObject?.NGAYGIO : null
    }
    const data = {
        "d": {
            "scada_qQ2N60h1DmL": {
                "Val": Val
            }
        },
        "ts": Date.now()
    }
    res.send(await callAPI())
})

app.get('/data/yesterday', async (req, res) => {
    let d = {}
    let startOfDate = moment().startOf('day').add(-1, 'day').format("YYYY-MM-DD HH:mm:ss")
    let params = {
        sNoList: "20698013,20697912,20697917,20697923,20697924,20697927,20697996,20697875,20697666,20697578,20697586,20697594",
        sTime: startOfDate
    }
    const response = await axios.get('http://14.225.244.63:8083/VendingInterface.asmx/SUNGRP_getInstant', { params })
    let xmlData = response.data
    let jsonData = xmlParser.toJson(xmlData)
    const valueData = JSON.parse(jsonData).DataTable['diffgr:diffgram'].DocumentElement?.dtResult
    const listModel = [20698013, 20697912, 20697917, 20697923, 20697924, 20697927, 20697996, 20697875, 20697666, 20697578, 20697586, 20697594]
    let Val = {}
    for (let i = 0; i < listModel.length; i++) {
        const dataObjectFilterByModel = valueData ? valueData.filter(value => value.MA_DIEMDO === listModel[i].toString()) : []
        const dataObject = dataObjectFilterByModel[dataObjectFilterByModel.length - 1]
        Val[`${listModel[i]}:MA_DIEMDO`] = valueData ? parseFloat(dataObject?.MA_DIEMDO) : 0
        Val[`${listModel[i]}:SO_CTO`] = valueData ? parseFloat(dataObject?.SO_CTO) : 0
        Val[`${listModel[i]}:IMPORT_KWH`] = valueData ? parseFloat(dataObject?.IMPORT_KWH) : 0
        Val[`${listModel[i]}:EXPORT_KWH`] = valueData ? parseFloat(dataObject?.EXPORT_KWH) : 0
        Val[`${listModel[i]}:IMPORT_VAR`] = valueData ? parseFloat(dataObject?.IMPORT_VAR) : 0
        Val[`${listModel[i]}:EXPORT_VAR`] = valueData ? parseFloat(dataObject?.EXPORT_VAR) : 0
        Val[`${listModel[i]}:Ia`] = valueData ? parseFloat(dataObject?.Ia) : 0
        Val[`${listModel[i]}:Ib`] = valueData ? parseFloat(dataObject?.Ib) : 0
        Val[`${listModel[i]}:Ic`] = valueData ? parseFloat(dataObject?.Ic) : 0
        Val[`${listModel[i]}:Ua`] = valueData ? parseFloat(dataObject?.Ua) : 0
        Val[`${listModel[i]}:Ub`] = valueData ? parseFloat(dataObject?.Ub) : 0
        Val[`${listModel[i]}:Uc`] = valueData ? parseFloat(dataObject?.Uc) : 0
        Val[`${listModel[i]}:Cosphi`] = valueData ? parseFloat(dataObject?.Cosphi) : 0
        Val[`${listModel[i]}:NGAYGIO`] = valueData ? dataObject?.NGAYGIO : " "
    }
    d[`${groupId}`] = {
        "Val": Val
    }
    const data = {
        "d": d,
        "ts": Date.now()
    }
    client.publish(mqttTopicSendata, JSON.stringify(data))
    res.send(data)
})

app.get('/delete', async (req, res) => {
    try {
        const deleteTagJson = deleteTag()
        await client.publish(mqttTopicCfg, JSON.stringify(deleteTagJson))
        res.send({ message: "Delete Sucessfully!", data: deleteTagJson })
    } catch (error) {
        console.log(error)
    }
})
app.get('/update', (req, res) => {
    try {
        const dataConfig = {
            "d": {
                "scada_UzVa32VanG4I": {
                    "TID": 1,
                    "Dsc": "descrp",
                    "Hbt": 60,
                    "PID": 1,
                    "BID": 0,
                    "UTg": {
                        "TEST": {
                            "Log": 1,
                            "SH": 1000,
                            "SL": 0,
                            "EU": "",
                            "DSF": "4.2",
                            "Alm": false,
                            "Name": "TEST",
                            "TID": 1,
                            "Dsc": "TEST",
                            "RO": 0,
                            "Ary": 1
                        },
                    },
                    // "DTg": {
                    //     "MA_DIEMDO": 1,
                    //     "SO_CTO": 1,
                    //     "IMPORT_KWH": 1,
                    //     "EXPORT_KWH": 1,
                    //     "IMPORT_VAR": 1,
                    //     "EXPORT_VAR": 1,
                    //     "Ia": 1,
                    //     "Ib": 1,
                    //     "Ic": 1,
                    //     "Ua": 1,
                    //     "Ub": 1,
                    //     "Uc": 1,
                    //     "Cosphi": 1,
                    //     "NGAYGIO": 1,
                    //     "ATag1": 1,
                    //     "ATag2": 1,
                    //     "ATag3": 1,
                    //     "ATag4": 1,
                    //     "ATag5": 1,
                    //     "DTag1": 1,
                    //     "DTag2": 1,
                    //     "DTag3": 1,
                    //     "DTag4": 1,
                    //     "DTag5": 1,
                    //     "TTag1": 1,
                    //     "TTag2": 1,
                    //     "TTag3": 1,
                    //     "TTag4": 1,
                    //     "TTag5": 1,
                    // },
                    // "Del": 1
                }
            },
            "ts": Date.now()
        }
        //client.publish('iot-2/evt/waconn/fmt/scada_UzVa32VanG4I', JSON.stringify(dataConn))
        console.log("success connect!")
        client.publish('iot-2/evt/wacfg/fmt/scada_UzVa32VanG4I', JSON.stringify(dataConfig))
        console.log("success config tag!")
        res.status({ message: "Config Tag Sucessfully!", data: dataConfig })
    } catch (error) {
        console.log(error)
    }
})

