const HeartBeatMessage = (groupId) => {
    let d = {}
    d[`${groupId}`] = { "Hbt": 1 }
    const dataHeartBeat = {
        "d": d,
        "ts": new Date().toISOString()
    }
    return dataHeartBeat
}
module.exports = HeartBeatMessage