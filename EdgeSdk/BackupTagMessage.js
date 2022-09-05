const TagBackUpValue = (tag, groupId) => {
    let d = {}
    let Val = {}
    Val[`${tag.name}`] = tag.last_value
        d[`${groupId}`] = {
            "Val": Val,
        }
    const dataTag = {
        "d": d,
        "ts": new Date().toISOString()
    }
    return dataTag
}

module.exports = TagBackUpValue

