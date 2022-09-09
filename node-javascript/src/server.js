const express = require('express')
const makeVideos = require('./makeVideos.js')
require('dotenv/config')

const PORT = process.env.PORT || 3333

const app = express()

app.get('/', (_, res) => {
  return res.json({
    message: 'Hi! This is my first app using Videomatik to create videos automatically :)'
  })
})

app.get('/videos', async (req, res) => {
  const videos = await makeVideos()
  return res.json({
    message: 'Your videos were created successfully!',
    videos
  })
})

app.listen(PORT, () => console.log(`==== Server is listening on port ${PORT} ====`))
