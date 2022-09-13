require('dotenv/config')
const VideomatikAPI = require('@videomatik/api')
const { getCustomJSON } = require('./getCustomJSON')
const downloadVideoFile = require('./downloadVideoFile')

// Data (my products and the custom JSON)
const products = require('./data/products.json')
const baseJSON = require('./templates/retailOfferMercadoLivre.json')

const videomatik = new VideomatikAPI({ apiKey: process.env.VIDEOMATIK_API_KEY })

// Returns the video request when fully rendered
const renderVideo = async (customJSON) => {
  const { id: videoRequestId } = await videomatik.createVideoRequest({
    templateId: 'oferta-varejo-nujyuua',
    customJSON,
    compositionId: 'default'
  })

  return new Promise((resolve, reject) => {
    const intervalId = setInterval(async () => {
      const videoRequest = await videomatik.getOneVideoRequest(videoRequestId)
      const videoState = videoRequest.renderJob.state

      if (videoState === 'error') {
        clearInterval(intervalId)
        const error = new Error(`An error ocurred while rendering video "${videoRequestId}".`)
        reject(error)
      } else if (videoState === 'finished') {
        clearInterval(intervalId)
        resolve(videoRequest)
      } else {
        console.log(`Video "${videoRequestId}" is at state "${videoState}".`)
      }
    }, 10000) // Every 10 seconds, check the video status
  })
}

const makeVideos = async () => {
  for (const product of products) {
    const customJSON = getCustomJSON(baseJSON, product)

    try {
      console.log(`Requesting to render video for product "${product.name}".`)
      const videoRequest = await renderVideo(customJSON)

      console.log(`Downloading video "${videoRequest.id}" to folder "rendered-videos"...`)
      await downloadVideoFile(
        videoRequest.renderJob.downloadURL,
        videoRequest.id
      )
      console.log('Download completed!\n')
    } catch (err) {
      console.error(err.message + '\n')
    }
  }

  console.log('All videos were downloaded successfully! Enjoy your videos :)')
}

makeVideos()
