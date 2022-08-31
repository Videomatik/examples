import express from 'express';

const app = express();

app.get('/', (req, res) => {
    return res.json({ 
        id: 1,
        message: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    })
})

app.listen(3333)