const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)

const Search = mongoose.model('Search', { name: String, date: { type: Date, default: Date.now } })

app.get('/searches', async (req, res) => res.json(await Search.find().sort({ date: -1 })))
app.post('/searches', async (req, res) => res.json(await Search.create(req.body)))

app.listen(3000, () => console.log('Backend running'))