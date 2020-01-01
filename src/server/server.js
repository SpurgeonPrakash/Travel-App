/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-syntax */
/**
 * SERVER SETUP
 */

const dotenv = require('dotenv');

dotenv.config();

const express = require('express');

const app = express();

const fetch = require('node-fetch');

/* Dependencies */
const bodyParser = require('body-parser');

/* Middleware */
// Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');

app.use(cors());

app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.sendFile('dist/index.html');
});

// designates what port the app will listen to for incoming requests
const port = 8081;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on ${port}!`);
});

/**
 * GEONAMES REQUEST
 */

let futureTrips = [];

// returns array objects containing geonames data (cityname, countryname, longitude and latitude)
async function requestGeonamesData(req, res) {
  futureTrips = [];

  // retrieve data from geonames
  let url = `http://api.geonames.org/searchJSON?username=${process.env.usernameGeonames}`;
  const { destination } = req.body;
  url = `${url}&name_equals=${destination}`;
  const response = await fetch(url);
  const data = await response.json();
  try {
    let counter = 0;
    let addCity = true;
    // filter data, delete datapoints of which the latitude and longitude values are close together
    // eslint-disable-next-line no-restricted-syntax
    for (const datapoint of data.geonames) {
      // eslint-disable-next-line no-restricted-syntax
      for (const place of futureTrips) {
        if (
          Math.abs(place.lat - datapoint.lat) < 15.0
          && place.countryName === datapoint.countryName
        ) {
          addCity = false;
        } else if (
          Math.abs(place.lng - datapoint.lng) < 15.0
          && place.countryName === datapoint.countryName
        ) {
          addCity = false;
        }
      }

      if (addCity) {
        const {
          toponymName, countryName, lng, lat,
        } = datapoint;
        futureTrips[counter] = {
          toponymName,
          countryName,
          lng,
          lat,
        };
        counter += 1;
      }
      addCity = true;
    }
    res.send(futureTrips);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e.toString());
  }
}
// geonames route for retrieving cities and their country names, longitude and latitude values
app.post('/geonames', requestGeonamesData);

/**
 * DARK SKY API
 */

// request average high and low temperature for trip start  //
async function weatherForecast(tripDate, latitude, longitude) {
  const tripDateSeconds = new Date(tripDate).getTime() / 1000;
  const url = `https://api.darksky.net/forecast/${process.env.API_KEY_DARK_SKY}/${latitude},${longitude},${tripDateSeconds}?exclude=currently,minutely,hourly,alerts`;
  const weatherforcast = await fetch(url);
  let result = {};
  try {
    const response = await weatherforcast.json();
    result = {
      tempHigh: response.daily.data[0].temperatureHigh,
      tempLow: response.daily.data[0].temperatureLow,
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e.toString());
  }
  return result;
}

app.post('/forecast', weatherForecast);

/**
 *  PIXABAY  API
 */

// request a picture for a given place, if not available then country
async function getPictures(place, country) {
  let url = `https://pixabay.com/api/?key=${process.env.API_KEY_PIXABAY}&q=${place},${country}&safesearch=true`;
  let pixabay = await fetch(url);
  let response = {};
  let result = {};
  try {
    response = await pixabay.json();
    result = { picURL: response.hits[0].webformatURL };
  } catch (e1) {
    try {
      url = `https://pixabay.com/api/?key=${process.env.API_KEY_PIXABAY}&q=${country}&safesearch=true`;
      pixabay = await fetch(url);
      response = await pixabay.json();
      result = { picURL: response.hits[0].webformatURL };
    } catch (e2) {
      // eslint-disable-next-line no-console
      console.log(`(${e1.toString()}) and (${e2.toString()})`);
    }
  }
  return result;
}

/**
 * HELPER FUNCTIONS
 */
const plannedDestinations = [];
let counterTripId = 0;

// app data array planned destionations contains core trip data
// changing data, such as weather and pic link are not stored,
// but requested each time the homepage reloads
function saveNewTrip(req, res) {
  const { index } = req.body;
  const newEntry = {
    destination: futureTrips[index].toponymName,
    date: req.body.date,
    country: futureTrips[index].countryName,
    lng: futureTrips[index].lng,
    lat: futureTrips[index].lat,
    id: counterTripId,
  };
  plannedDestinations.push(newEntry);
  counterTripId += 1;
  res.send(true);
}

app.post('/saveTrip', saveNewTrip);

// delete upcoming trip
function deleteUpcomingTrip(req, res) {
  const tripId = req.body.id;
  let counter = 0;
  for (const trip of plannedDestinations) {
    if (trip.id === tripId) {
      plannedDestinations.splice(counter, 1);
    }
    counter += 1;
  }
  res.send({ deletedTripId: tripId });
}
app.post('/deleteTrip', deleteUpcomingTrip);

// future trips, enriched with weather and picture data
async function getFutureTrips(req, res) {
  const today = new Date();
  let tripDate;
  let differenceInTime;

  const fullTripData = [];

  const differenceInDays = [];
  const responseWeather = [];
  const responsePic = [];

  for (const trip of plannedDestinations) {
    // To set two dates to two variables
    tripDate = new Date(trip.date);

    // To calculate the time difference of two dates
    differenceInTime = tripDate.getTime() - today.getTime();

    // To calculate the no. of days between two dates
    differenceInDays.push(Math.floor(differenceInTime / (1000 * 3600 * 24)));

    responseWeather.push(weatherForecast(tripDate, trip.lat, trip.lng));
    responsePic.push(getPictures(trip.destination, trip.country));
  }

  await Promise.all(responseWeather, responsePic)
    .then(() => {
      console.log(responseWeather[0]);
      console.log(responsePic[0]);
      let counter = 0;
      for (const trip of plannedDestinations) {
        try {
          const newEntry = {
            // eslint-disable-next-line node/no-unsupported-features/es-syntax
            ...trip,
            daysUntilTripStart: differenceInDays,
            temperatureHigh: responseWeather[counter].tempHigh,
            temperatureLow: responseWeather[counter].tempLow,
            picURL: responsePic[counter].picURL,
          };
          fullTripData.push(newEntry);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(e.toString());
        }
        counter += 1;
      }
      res.send(fullTripData);
    });
}

app.post('/futureTrips', getFutureTrips);
