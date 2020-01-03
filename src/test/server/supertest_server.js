/* eslint-disable node/no-unsupported-features/es-syntax */
// module.import = {requestGeonamesData} from './server';
const dotenv = require('dotenv');

dotenv.config();

const express = require('express');

const app = express();

/* Dependencies */
const bodyParser = require('body-parser');

/* Middleware */
// Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');

app.use(cors());

const func = require('../../server/server_func');

app.post('/geonames', function(req, res) {
  func.requestGeonamesData(req, res);
});

module.exports = app;
