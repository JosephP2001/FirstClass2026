const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)

const Post = mongoose.model('Post', { title: String })

app.get('/posts', async (req, res) => res.json(await Post.find()))
app.post('/posts', async (req, res) => res.json(await Post.create(req.body)))

app.listen(3000, () => console.log('Backend running'))