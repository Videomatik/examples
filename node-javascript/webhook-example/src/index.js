require('dotenv/config.js')
const express = require('express')
const ngrok = require('ngrok')
const makeVideos = require('./makeVideos.js')
const downloadVideoFile = require('./downloadVideoFile')
const products = require('./data/products.json')

const PORT = process.env.PORT || 3333
let downloadCount = 0

const app = express()
app.use(express.json())

app.post('/videomatik-webhook', async (req, res) => {
  const { videoRequestId, downloadURL, state } = req.body

  if (state === 'render') {
    console.log(`Video "${videoRequestId}" started rendering.`)
  } else if (state === 'finished') {
    console.log(`Video "${videoRequestId}" is fully rendered! Downloading it...`)
    await downloadVideoFile(downloadURL, videoRequestId)
    downloadCount++
    console.log(`Video "${videoRequestId}" download completed! Check the "rendered-videos" folder.`)
  } else {
    console.log(`The video from request "${videoRequestId}" is at state "${state}".`)
  }

  // Respond to Videomatik
  res.json({
    message: 'Webhook received successfully!'
  })

  if (downloadCount === products.length) {
    console.log('\nAll videos were downloaded! Exiting...')
    process.exit(0) // Finish the process with no failures
  }
})

app.listen(PORT, async () => {
  console.log('Starting videos production...')
  const publicURL = await ngrok.connect(PORT)
  const webhookURL = `${publicURL}/videomatik-webhook`
  await makeVideos(webhookURL)
})
