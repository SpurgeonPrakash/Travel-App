///////////////////////////////////////////////////////
// SERVER SETUP                                      //
///////////////////////////////////////////////////////

const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()

const fetch = require("node-fetch")

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


///////////////////////////////////////////////////////
// GEONAMES REQUEST                                  //
///////////////////////////////////////////////////////

let futureTrips = []
// geonames route for retrieving cities and their country names, longitude and latitude values
app.post('/geonames', requestGeonamesData)
// returns array objects containing geonames data (cityname, countryname, longitude and latitude)
async function requestGeonamesData(req, res) {

    let url = 'http://api.geonames.org/searchJSON?username=' + process.env.usernameGeonames
    futureTrips = []
    let destination = req.body.destination

    try {
        // retrieve data from geonames
        url = url + "&name_equals=" + destination
        const response = await fetch(url)
        var data = await response.json()

        let counter = 0
        let addCity = true
        // filter data, datapoints with close latitude and longitude values are deleted
        for (const datapoint of data.geonames) {
            for (const place of futureTrips) {
                if ((Math.abs(place.lat - datapoint.lat) < 15.0) && (place.countryName == datapoint.countryName)) {
                    addCity = false
                }
                else if ((Math.abs(place.lng - datapoint.lng) < 15.0) && (place.countryName == datapoint.countryName)) {
                    addCity = false
                }
            }

            if (addCity) {
                let { toponymName, countryName, lng, lat } = datapoint
                futureTrips[counter] = { toponymName, countryName, lng, lat }
                counter++
            }
            addCity = true
        }
        res.send(futureTrips)

    } catch (e) {
        console.log(e.toString())
    }

}
///////////////////////////////////////////////////////
// DARK SKY API                                      //
///////////////////////////////////////////////////////
app.post('/forecast', weatherForecast)
async function weatherForecast(tripDate, latitude, longitude) {
    const tripDateSeconds = new Date(tripDate).getTime() / 1000

    const url = `https://api.darksky.net/forecast/${process.env.API_KEY_DARK_SKY}/${latitude},${longitude},${tripDateSeconds}?exclude=currently,minutely,hourly,alerts`

    const weatherforcast = await fetch(url)
    try {
        const result = await weatherforcast.json()
        return { tempHigh: result.daily.data[0].temperatureHigh, tempLow: result.daily.data[0].temperatureLow }
    } catch (e) {
        console.log(e.toString())
    }
}

///////////////////////////////////////////////////////
// DARK SKY API                                      //
///////////////////////////////////////////////////////
async function getPictures(place, country) {
    const url = `https://pixabay.com/api/?key=${process.env.API_KEY_PIXABAY}&q=${place},${country}&safesearch=true`
    const pictures = await fetch(url)
    try {
        const result = await pictures.json()
        return { picURL: result.hits[0].webformatURL }

    } catch (e) {
        console.log(e.toString())
    }

}


///////////////////////////////////////////////////////
// HELPER FUNCTIONS                                  //
///////////////////////////////////////////////////////
let plannedDestinations = []
let counterTripId = 0

app.post('/saveTrip', saveNewTrip)
function saveNewTrip(req, res) {
    let index = req.body.index
    newEntry = {
        destination: futureTrips[index].toponymName,
        date: req.body.date,
        country: futureTrips[index].countryName,
        lng: futureTrips[index].lng,
        lat: futureTrips[index].lat,
        id: counterTripId
    }
    plannedDestinations.push(newEntry)
    counterTripId++
    res.send(true)
}

app.post('/deleteTrip', deleteUpcomingTrip)
function deleteUpcomingTrip(req, res) {
    let tripId = req.body.id
    let counter = 0
    for (const trip of plannedDestinations) {
        if (trip.id == tripId) {
            plannedDestinations.splice(counter, 1)
        }
        counter++
    }
    res.send({ deletedTripId: tripId })
}

app.post('/futureTrips', getFutureTrips)
async function getFutureTrips(req, res) {
    let today = new Date();
    let tripDate
    let differenceInTime
    let latitude
    let longitude

    let fullTripData = []

    for (const trip of plannedDestinations) {
        // To set two dates to two variables 
        tripDate = new Date(trip.date)

        // To calculate the time difference of two dates 
        differenceInTime = tripDate.getTime() - today.getTime();

        // To calculate the no. of days between two dates 
        var differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

        latitude = trip.lat
        longitude = trip.lng

        // let temperatureHigh = responseWeather.tempHigh
        // let temperatureLow = responseWeather.tempLow
        const responseWeather = await weatherForecast(tripDate, latitude, longitude)
        const responsePic = await getPictures(trip.destination, trip.country)
        try {
            newEntry = {
                ...trip,
                daysUntilTripStart: differenceInDays,
                temperatureHigh: responseWeather.tempHigh,
                temperatureLow: responseWeather.tempLow,
                picURL: responsePic.picURL
            }
            fullTripData.push(newEntry)

        } catch (e) {
            console.log(e.toString())
        }

    }
    res.send(fullTripData)
}







