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

app.get('/surprise', (_, res) => {
  return res.json({
    message: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  })
})

app.get('/videos', async (req, res) => {
  const videosAmount = parseInt(req.query.amount)
  const videos = await makeVideos(videosAmount)
  return res.json({
    message: 'Your videos were created successfully!',
    videos
  })
})

app.listen(PORT, () => console.log(`==== Server is listening on port ${PORT} ====`))
