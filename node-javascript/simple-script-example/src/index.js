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

// Returns the video URL when fully rendered
const renderVideo = async (videoNumber, customJSON) => {
  const { id: videoRequestId } = await videomatik.createVideoRequest({
    templateId: 'oferta-varejo-nujyuua',
    customJSON,
    compositionId: 'default'
  })

  return new Promise((resolve, reject) => {
    const intervalId = setInterval(async () => {
      const videoRequest = await videomatik.getOneVideoRequest(videoRequestId)
      const videoState = videoRequest.renderJob.state

      if (videoState === 'error' || videoNumber === 3) {
        clearInterval(intervalId)
        const error = new Error(`An error ocurred while rendering the #${videoNumber} video.`)
        reject(error)
      }
      else if (videoState === 'finished') {
        clearInterval(intervalId)
        resolve(videoRequest.renderJob.downloadURL)
      } else {
        console.log(`Video #${videoNumber} is at state \"${videoState}\"`)
      }
    }, 5000) // Every 5 seconds, check the video status
  })
}

const makeVideos = async ({ download = false } = {}) => {
  const arrCustomJSON = products.map(prod => getCustomJSON(baseJSON, prod))

  for (const i in arrCustomJSON) {
    const customJSON = arrCustomJSON[i]

    try {
      const videoURL = await renderVideo(i + 1, customJSON)
      if (download) {
        // Download the video in the "rendered-videos" folder
      }
    } catch (err) {
      console.error(err.message)
    }
  }
}

makeVideos({ download: false })
