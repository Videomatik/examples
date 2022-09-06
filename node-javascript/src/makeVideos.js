const VideomatikAPI = require('@videomatik/api')
const getProductCustomJSON = require('./getProductCustomJSON')
const products = require('./data/products.json')
require('dotenv/config')

const videomatik = new VideomatikAPI({
  apiKey: process.env.API_KEY
})

const makeVideos = async (amount) => {
  if (amount > products.length) {
    throw new Error(`There are no sufficient products for producing ${amount} videos. Please, choose a number in the interval [1, ${products.length}].`)
  }
  const selectedProducts = products.slice(0, amount)

  const arrCustomJSON = selectedProducts.map(prod => getProductCustomJSON(prod))

  const videoRequestPromises = arrCustomJSON.map(async (customJSON) => {
    const videoRequest = await videomatik.createVideoRequest({
      templateId: 'oferta-varejo-nujyuua', // <- ID do Template
      customJSON,
      compositionId: 'default', // <- Vertical, neste template pode ser: default (Vertical), feed (Quadrado)
      actions: process.env.WEBHOOK_URL
        ? [
            // Você pode colocar um Webhook para ser notificado quando o vídeo ficar pronto
            {
              type: 'webhook',
              url: process.env.WEBHOOK_URL
            }
          ]
        : []
    })

    return videoRequest
  })

  return await Promise.all(videoRequestPromises)
}

module.exports = makeVideos
