require('dotenv/config')

const fs = require('fs')
const path = require('path')
const axios = require('axios')
const VideomatikAPI = require('@videomatik/api')
const { getCustomJSON } = require('./utils')

const products = require('./data/products.json')
const baseJSON = require('./templates/retailOfferMercadoLivre.json')

const videomatik = new VideomatikAPI({
  apiKey: process.env.API_KEY
})

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
        const error = new Error(`An error ocurred while rendering video #${videoNumber}`)
        reject(error)
      } else if (videoState === 'finished') {
        clearInterval(intervalId)
        resolve(videoRequest.renderJob.downloadURL)
      } else {
        console.log(`Video #${videoNumber} is at state "${videoState}"`)
      }
    }, 5000) // Every 5 seconds, check the video status
  })
}

const makeVideos = async ({ download = false } = {}) => {
  const arrCustomJSON = products.map(prod => getCustomJSON(baseJSON, prod))
  const folderName = 'rendered-videos'

  for (const i in arrCustomJSON) {
    const customJSON = arrCustomJSON[i]

    try {
      const videoNumber = parseInt(i) + 1
      const videoURL = await renderVideo(videoNumber, customJSON)

      if (download) {
        console.log(`Downloading video #${videoNumber} to folder "${folderName}"...`)

        const response = await axios.request({
          url: videoURL,
          responseType: 'arraybuffer'
        })
        const filename = path.join(__dirname, folderName, `video-${videoNumber}.mp4`)
        fs.writeFileSync(filename, response.data)

        console.log('Download completed! Enjoy your video :)\n')
      }
    } catch (err) {
      console.error(err.message + '\n')
    }
  }
}

makeVideos({ download: true })
