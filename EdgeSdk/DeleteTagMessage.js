const DeleteTag = (tag, groupId, heatbeat) => {
    let d = {}
    let DTg = {}
    DTg[`${tag.name}`] = 1
    d[`${groupId}`] = {
        "TID": 1,
        "Dsc": tag.description,
        "Hbt": heatbeat,
        "PID": 1,
        "BID": 0,
        "DTg": DTg,
        "Del": 1
    }
    const dataConfig = {
        "d": d,
        "ts": Date.now()
    }
    return dataConfig
}

module.exports = DeleteTag