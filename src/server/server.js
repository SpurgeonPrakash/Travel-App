const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()

// let appData = {}

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
app.listen(port, function () {
    console.log(`Example app listening on ${port}!`)
})

// initial aylien setup
var AYLIENTextAPI = require('aylien_textapi')
var textapi = new AYLIENTextAPI({
    application_id: process.env.API_ID,
    application_key: process.env.API_KEY
})

// sentiment route for natural language processing api 'aylien'
// app.post('/sentiment', getSentimentAnalysis)

// function getSentimentAnalysis(req, res) {

//     let nameURL = req.body.url
//     appData = {}

//     textapi.sentiment({
//         url: nameURL,
//         mode: 'document'
//     },
//         function (error, response) {
//             if (error === null) {
//                 appData['polarity'] = response.polarity
//                 appData['polarityConfidence'] = response.polarity_confidence
//                 appData['subjectivity'] = response.subjectivity
//                 appData['subjectivityConfidence'] = response.subjectivity_confidence
//                 appData['status'] = 'OK'
//                 res.send(appData)
//             } else {
//                 appData['status'] = 'server error: e.g. no article found'
//                 res.send(appData)
//             }

//         })

// }

// geonames route for retrieving cities and their country names, longitude and latitude values
app.post('/geonames', requestGeonamesData)

let possibleDestinations = []
async function requestGeonamesData(req, res) {

    let url = 'http://api.geonames.org/searchJSON?username=' + process.env.usernameGeonames

    possibleDestinations = []

    let destination = req.body.destination

    try {
        url = url + "&name_equals=" + destination
        const fetch = require("node-fetch")
        const response = await fetch(url)
        var data = await response.json()
        let counter = 0
        let addCity = true
        for (const datapoint of data.geonames) {
            for (const place of possibleDestinations) {
                if ((Math.abs(place.lat - datapoint.lat) < 15.0) && (place.countryName == datapoint.countryName)) {
                    addCity = false
                }
                else if ((Math.abs(place.lng - datapoint.lng) < 15.0) && (place.countryName == datapoint.countryName)) {
                    addCity = false
                }
            }

            if (addCity) {
                let { toponymName, countryName, lng, lat } = datapoint
                possibleDestinations[counter] = { toponymName, countryName, lng, lat }
                counter++
            }
            addCity = true
        }
        res.send(possibleDestinations)

    } catch (e) {
        console.log(e.toString())
    }

}

let plannedDestinations = []
let counterTripId = 0

app.post('/saveTrip', saveNewTrip)

function saveNewTrip(req, res) {
    let index = req.body.index
    newEntry = {
        destination: possibleDestinations[index].toponymName,
        date: req.body.date,
        country: possibleDestinations[index].countryName,
        lng: possibleDestinations[index].lng,
        lat: possibleDestinations[index].lat,
        id: counterTripId
    }
    plannedDestinations.push(newEntry)
    // console.log(plannedDestinations)
    counterTripId++
    res.send(plannedDestinations)
}


app.post('/deleteTrip', deleteUpcomingTrip)

function deleteUpcomingTrip(req, res) {
    let tripId = req.body.id
    // console.log(req)
    let counter = 0
    for (const trip of plannedDestinations) {
        console.log(`tripID ${tripId}`)
        if (trip.id == tripId) {
            plannedDestinations.splice(counter, 1)

        }
        counter++
    }
    // console.log("Revised upcoming trips")
    // console.log(plannedDestinations)
    console.log("outside")
    console.log(plannedDestinations)
    console.log(toString(tripId))
    res.send({ deletedTripId: tripId })
}

