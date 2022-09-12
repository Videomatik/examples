const getCustomJSON = (baseJSON, data) => {
  let strCustomJSON = JSON.stringify(baseJSON)

  Object.entries(data).forEach(([key, value]) => {
    const pattern = new RegExp(`#{${key}}`, 'g')
    const escapedValue = JSON.stringify(value).slice(1, -1)
    strCustomJSON = strCustomJSON.replace(pattern, escapedValue)
  })

  return JSON.parse(strCustomJSON)
}

module.exports = { getCustomJSON }
