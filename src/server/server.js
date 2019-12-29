const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()

let appData = {}

/* Dependencies */
const bodyParser = require('body-parser')
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Cors for cross origin allowance
const cors = require('cors')
app.use(cors())

app.use(express.static('dist'))

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// designates what port the app will listen to for incoming requests
const port = 8081
app.listen(8081, function () {
    console.log(`Example app listening on ${port}!`)
})

// initial aylien setup
var AYLIENTextAPI = require('aylien_textapi')
var textapi = new AYLIENTextAPI({
    application_id: process.env.API_ID,
    application_key: process.env.API_KEY
})

// sentiment route for natural language processing api 'aylien'
app.post('/sentiment', getSentimentAnalysis)

function getSentimentAnalysis(req, res) {

    let nameURL = req.body.url
    appData = {}

    textapi.sentiment({
        url: nameURL,
        mode: 'document'
    },
        function (error, response) {
            if (error === null) {
                appData['polarity'] = response.polarity
                appData['polarityConfidence'] = response.polarity_confidence
                appData['subjectivity'] = response.subjectivity
                appData['subjectivityConfidence'] = response.subjectivity_confidence
                appData['status'] = 'OK'
                res.send(appData)
            } else {
                appData['status'] = 'server error: e.g. no article found'
                res.send(appData)
            }

        })

}