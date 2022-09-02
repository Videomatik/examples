import express from 'express';
import 'dotenv/config';
import makeVideos from './makeVideos'

type None = {}

interface ResMessage {
    message: string
}

interface ResVideos extends ResMessage {
    videos: URL[]
}

interface ReqQueryParams {
    amount: string
}

const app = express();

app.get<None, ResMessage, None, None>('/', (_, res) => {
    return res.json({ 
        message: 'Hi! This is my first app using Videomatik to create videos automatically :)' 
    })
})

app.get<None, ResMessage, None, None>('/surprise', (_, res) => {
    return res.json({ 
        message: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    })
})

app.get<None, ResVideos, None, ReqQueryParams>('/videos', async (req, res) => {
    const videosAmount = parseInt(req.query.amount);
    const videos = await makeVideos(videosAmount)
    return res.json({
        message: 'Your videos were created successfully!',
        videos
    })
})

app.listen(process.env.PORT)