const { execSync } = require('child_process')
const express = require('express');
const runner = require('./runner')
var cors = require('cors')
const app = express();
const PORT = 8080;


runner.movielist()

const loadmovie = `
import pickle

filename = './pickles/movies'
moviedata = pickle.load(open(filename, 'rb'))
print(moviedata)
`
const loadrecommendations = `
import pickle

filename = './pickles/recommendations'
rec = pickle.load(open(filename, 'rb'))
print(rec)
`

const moviedata = execSync(`python -c "${loadmovie}"`).toString()
const deserilazedmoviedata = JSON.parse(moviedata)


app.use(express.json({limit: '25mb'}))
app.use(express.urlencoded({limit: '25mb', extended: true}))
app.use(cors({
    origin: "*",
  }))

app.listen(PORT)

var movieRecommendation
let updatedRecommendation = false

const recommendMiddleware = (req, res, next) => {
    if(updatedRecommendation) {
        next()
    }
    else {
        res.status(200).send([])
    }
}

app.get('/movies', (req, res) =>  {
    res.status(200).send(deserilazedmoviedata)
})

app.get('/recommendations', recommendMiddleware, (req, res) =>  {
    res.status(200).send(movieRecommendation)
})

app.post('/recommend-request', async (req, res) =>  {
    updatedRecommendation = false
    const {liked, disliked} = req.body
    await runner.predict(liked, disliked)
    // await runner.predict([12,4], [19])
    const recommendations = execSync(`python -c "${loadrecommendations}"`).toString()
    const deserilazedmovierecommendations = JSON.parse(recommendations)
    movieRecommendation = deserilazedmovierecommendations
    updatedRecommendation = true
})

