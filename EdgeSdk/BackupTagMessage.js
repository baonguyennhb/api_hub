const BackupTagValue = (tags, groupId, timestamp) => {
    let d = {}
    let Val = {}
    for (let i = 0; i < tags.length; i++) {
        Val[`${tags[i].name}`] = tags[i].last_value
        d[`${groupId}`] = {
            "Val": Val,
        }
    }
    const dataTag = {
        "d": d,
        "ts": timestamp
    }
    return dataTag
}

module.exports = BackupTagValue

