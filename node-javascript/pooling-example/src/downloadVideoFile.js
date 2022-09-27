const fs = require('fs')
const path = require('path')
const axios = require('axios')

const downloadVideoFile = async (videoURL, videoName) => {
  const response = await axios.request({
    url: videoURL,
    responseType: 'arraybuffer'
  })

  const filename = path.join(__dirname, 'rendered-videos', `${videoName}.mp4`)
  fs.writeFileSync(filename, response.data)
}

module.exports = downloadVideoFile
