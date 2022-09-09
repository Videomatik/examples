const VideomatikAPI = require('@videomatik/api')
const products = require('./data/products.json')
const baseJSON = require('./templates/retailOfferMercadoLivre.json')
require('dotenv/config')

const videomatik = new VideomatikAPI({
  apiKey: process.env.API_KEY
})

const getCustomJSON = (baseJSON, data) => {
  let strCustomJSON = JSON.stringify(baseJSON)

  Object.entries(data).forEach(([key, value]) => {
    const pattern = new RegExp(`#{${key}}`, 'g')
    const escapedValue = JSON.stringify(value).slice(1, -1)
    strCustomJSON = strCustomJSON.replace(pattern, escapedValue)
  })

  return JSON.parse(strCustomJSON)
}

const makeVideos = async (pooling = true) => {
  const arrCustomJSON = products.map(prod => getCustomJSON(baseJSON, prod))

  const videoRequestPromises = arrCustomJSON.map(async (customJSON) => {
    const videoRequest = await videomatik.createVideoRequest({
      templateId: 'oferta-varejo-nujyuua',
      customJSON,
      compositionId: 'default',
      actions: pooling
        ? []
        : [
          // You can put a webhook to be notified when the video is ready
            {
              type: 'webhook',
              url: process.env.WEBHOOK_URL
            }
          ]
    })

    return videoRequest
  })

  return await Promise.all(videoRequestPromises)
}

module.exports = makeVideos
