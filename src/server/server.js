/* eslint-disable no-await-in-loop */
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

// const fetch = require('node-fetch');

/* Dependencies */
const bodyParser = require('body-parser');

/* Middleware */
// Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');

app.use(cors());

const func = require('./server_func');

app.use(express.static('dist'));

app.get('/', (_req, res) => {
  res.sendFile('dist/index.html');
});

// designates what port the app will listen to for incoming requests
const port = 8081;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on ${port}!`);
});

app.post('/geonames', func.requestGeonamesData);
app.post('/forecast', func.weatherForecast);
app.post('/saveTrip', func.saveNewTrip);
app.post('/deleteTrip', func.deleteUpcomingTrip);
app.post('/futureTrips', func.getFutureTrips);
