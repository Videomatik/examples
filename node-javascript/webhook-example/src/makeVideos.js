require('dotenv/config')
const VideomatikAPI = require('@videomatik/api')
const getCustomJSON = require('./getCustomJSON')

// Data (my products and the custom JSON)
const products = require('./data/products.json')
const baseJSON = require('./templates/retailOfferMercadoLivre.json')

const videomatik = new VideomatikAPI({ apiKey: process.env.VIDEOMATIK_API_KEY })

const makeVideos = async (webhookURL) => {
  const videoRequestPromises = products.map(async (product) => {
    const customJSON = getCustomJSON(baseJSON, product)
    try {
      console.log(`Requesting to render video for product "${product.name}".`)

      const videoRequest = await videomatik.createVideoRequest({
        templateId: 'oferta-varejo-nujyuua',
        customJSON,
        compositionId: 'default',
        actions: [{
          type: 'webhook',
          url: webhookURL
        }]
      })

      console.log(`Video request "${videoRequest.id}" created.`)
      return videoRequest
    } catch (err) {
      console.error('An error ocurred while creating the video request:', err.message)
      return null
    }
  })

  const videoRequests = await Promise.all(videoRequestPromises)
  return videoRequests
}

module.exports = makeVideos
