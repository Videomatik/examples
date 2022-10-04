require('dotenv/config')
const VideomatikAPI = require('@videomatik/api')
const getCustomJSON = require('./getCustomJSON')
const downloadVideoFile = require('./downloadVideoFile')

// Data (my products and the custom JSON)
const products = require('./data/products.json')
const baseJSON = require('./templates/retailOfferMercadoLivre.json')

const videomatik = new VideomatikAPI({ apiKey: process.env.VIDEOMATIK_API_KEY })

// Returns the video request when fully rendered
const renderVideo = async (customJSON) => {
  try {
    const newVideoRequest = await videomatik.createVideoRequest({
      // templateId: 'tdc-business-trilha-vertical-ic0w1eb',
      templateId: 'oferta-varejo-nujyuua',
      customJSON,
      compositionId: 'default'
    })

    return new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        const videoRequest = await videomatik.getOneVideoRequest(newVideoRequest.id)
        const videoState = videoRequest.renderJob.state

        if (videoState === 'error') {
          clearInterval(intervalId)
          const error = new Error(`An error ocurred while rendering video "${newVideoRequest.id}".`)
          reject(error)
        } else if (videoState === 'finished') {
          clearInterval(intervalId)
          resolve(videoRequest)
        } else {
          console.log(`Video "${newVideoRequest.id}" is at state "${videoState}".`)
        }
      }, 10000) // Every 10 seconds, check the video status
    })
  } catch (error) {
    throw new Error(`Video request creation failed with status code ${error.response.status} and message: "${error.response.data.message}"`)
  }
}

const makeVideos = async () => {
  let foundErrorsDuringVideosCreation = false

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
      foundErrorsDuringVideosCreation = true
    }
  }

  if (foundErrorsDuringVideosCreation) {
    console.log('There were errors while creating the videos. Please, refer to the previous messages to know which ones.')
  } else {
    console.log('All videos were downloaded successfully! Enjoy your videos :)')
  }
}

makeVideos()
