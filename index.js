const express = require('express')
const axios = require('axios').default;
var parseString = require('xml2js').parseString;
const port = 5000

const app = express()

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


const mqtt = require('mqtt');
var options = {
    port: 1883,
    username: 'Goy2waYPAGQP:n3Q78J2BBKeK',
    password: 'CVemCimzm0duGLr6OnvJ',
};

const client = mqtt.connect("mqtt://rabbitmq-001-pub.hz.wise-paas.com.cn:1883", options );

client.on("connect", ack => {
    console.log("MQTT Client Connected!")
})

app.get('/', (req, res) => {
    axios({
        method: 'get',
        url: 'http://14.225.244.63:8083/VendingInterface.asmx/SUNGRP_getInstant?sNoList=20698013&sTime=2022-07-12 23:00:00',
        responseType: 'json'
    })
        .then(function (response) {
            parseString(response.data, function (err, result) {
                // parsing to json
                let data = JSON.stringify(result)
                // display the json data
                console.log(JSON.parse(data).DataTable['diffgr:diffgram'][0].DocumentElement[0].dtResult[0])
                res.send(JSON.parse(data).DataTable['diffgr:diffgram'][0].DocumentElement[0].dtResult[0])
            });
        });
})


