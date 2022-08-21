const ConnectionMessage = (groupId) => {
    let d = {}
    d[`${groupId}`] = { "Con": 1 }
    const dataConn = {
        "d": d,
        "ts": new Date().toISOString()
    }
    return dataConn
}

module.exports = ConnectionMessage