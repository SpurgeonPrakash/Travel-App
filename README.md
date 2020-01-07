# Travel App

## Project Objective

The objective is to build a website that allows the user to add future trips.

The user can enter a destination of interest and save his trip. A countdown and a weather forecast are displayed. The user can delete any trip.

## Get Started
Created .env file and enter your API keys and credentials for geonames, darksky and pixabay.
usernameGeonames= "abc"
API_KEY_DARK_SKY = "abc123"
API_KEY_PIXABAY = "xyz789"

## Comments

### Architecture

Added additional folder test/server. See testing below.

### Webpack

The scripts 'start', 'build-prod' and 'build-dev' are as described in class.

Test scripts: See description next paragraph.

The script 'startAll' is for development. It rebuilds the dist folder, and restarts the express server after file changes.

### Testing

The script 'test' is for testing the client side (with fetch-mock-jest) .

The scripts 'supertest_server' and 'supertest_unittest' is for testing routes on the server side. The corresponding test files are located in the folder src/test/server.

### Offline capabilities

Service worker was implemented as in class.

## HTML & CSS

### Visual Design

-when user clicks '+ add trip' button, the window scrolls down to the search field for places.
-sticky header

## API and JS Integration

### Extend Options

User can delete a trip.

## Documentation

### Code Quality

Code is reviewed by ESLint.

## Result

<figure>
<figcaption>GUI when no trip has been planned yet.</figcaption>
<img src="./src/client/media/readme1.png" width="400">
</figure>
<br>

<figure>
<figcaption>GUI when user has searched for a city.</figcaption>
<img src="./src/client/media/readme2.png" width="400">
</figure>
<br>

<figure>
<figcaption>GUI when user added a city to his trip list.</figcaption>
<img src="./src/client/media/readme3.png" width="400">
</figure>
