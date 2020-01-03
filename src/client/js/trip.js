/**
 * Send new trip data to server
 * @param {Object} newTrip
 * @param {number} newTrip.index dropdown list number
 * @param {date} newTrip.date start date of trip
 */
const saveTripServer = async (newTrip = {}) => {
  let result = {};
  const url = 'http://localhost:8081/saveTrip';
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newTrip)
  });

  try {
    result = await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Trip was not saved.', error);
  }
  return result;
};

/**
 * Get upcoming trips from the server, data is enriched by countdown and temperature "forecast"
 * @return {Array<{toponymName: string, countryName: string, lng: number, lat: number, differenceInDays: number, temperatureHigh: number, temperatureLow: number, picURL: string}>}
 */
const getUpcomingTripsServer = async () => {
  let result = {};
  const url = 'http://localhost:8081/futureTrips';
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify()
  });
  try {
    result = await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Trip was not deleted');
  }
  return result;
};

/**
 * Helper function to delete future trip on the server
 * @param {Objecy} trip
 * @param {number} trip.id
 * @return {{deletedTripId: number}}
 */
const deleteUpcomingTrip = async (trip = {}) => {
  let result = {};
  const url = 'http://localhost:8081/deleteTrip';
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(trip)
  });
  try {
    result = await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Trip was not deleted');
  }
  return result;
};

//

/**
 * Displays upcoming trips in browser window
 */
async function getUpcomingTripsBrowser() {
  const upcomingTrips = await getUpcomingTripsServer();

  // no upcoming trips
  if (upcomingTrips.length === 0) {
    const commentUpcomingTrips = document.querySelector(
      '#commentUpcomingTrips'
    );
    commentUpcomingTrips.innerHTML = 'No plans yet.';
    return;
  }

  const divUpcomingTrips = document.querySelector('#upcomingTrips');
  while (divUpcomingTrips.firstChild) {
    divUpcomingTrips.firstChild.remove();
  }
  const frag = document.createDocumentFragment();

  // eslint-disable-next-line no-restricted-syntax
  for (const trip of upcomingTrips) {
    let section = document.createElement('SECTION');

    const h3TripDetails = document.createElement('H3');
    h3TripDetails.innerHTML = `${trip.destination}, ${trip.country} on ${trip.date}`;
    section.appendChild(h3TripDetails);

    const pTripCountdown = document.createElement('P');
    pTripCountdown.innerHTML = `Trip is ${trip.daysUntilTripStart} days away.`;
    section.appendChild(pTripCountdown);

    const pTemperature = document.createElement('P');
    pTemperature.innerHTML = `Typical weather for then is: high ${trip.temperatureHigh}F, low ${trip.temperatureLow}F.`;
    section.appendChild(pTemperature);

    const imgTrip = document.createElement('IMG');
    const imgURL = `${trip.picURL}`;
    const imgSmallerSize = imgURL.replace('_640', '_180');
    imgTrip.src = imgSmallerSize;
    section.appendChild(imgTrip);

    const tripId = trip.id;
    section.setAttribute('id', `trip${tripId}`);

    const deleteTripButton = document.createElement('BUTTON');
    deleteTripButton.innerHTML = 'delete';
    section.appendChild(deleteTripButton);
    deleteTripButton.addEventListener('click', () => {
      deleteUpcomingTrip({
        id: tripId
      }).then(id => {
        section = document.querySelector(`#trip${id.deletedTripId}`);
        while (section.firstChild) {
          section.firstChild.remove();
        }
        section.parentNode.removeChild(section);
        const div = document.querySelector('#upcomingTrips');
        if (div.childNodes.length === 0) {
          const commentUpcomingTrips = document.querySelector(
            '#commentUpcomingTrips'
          );
          commentUpcomingTrips.innerHTML = 'No plans yet.';
        }
      });
    });
    frag.appendChild(section);
  }
  divUpcomingTrips.appendChild(frag);

  const commentUpcomingTrips = document.querySelector('#commentUpcomingTrips');
  commentUpcomingTrips.innerHTML = '';

  const sectionSaveNewTrip = document.querySelector('#sectionSaveNewTrip');
  sectionSaveNewTrip.style.display = 'none';

  const sectionSearchDestination = document.querySelector(
    '#sectionSearchDestination'
  );
  sectionSearchDestination.style.display = 'block';

  const destinationInput = document.querySelector('#destinationInput');
  destinationInput.value = '';
}

/**
 * Function saves a new trip, and rebuilds upcoming trip section
 */
async function saveTrip() {
  // get new destination
  const select = document.getElementById('placelist');
  const selection = select.options[select.selectedIndex].value;

  // get new date
  const newDate = document.getElementById('newTripStart').value;

  await saveTripServer({
    index: selection,
    date: newDate
  });
  getUpcomingTripsBrowser();
}

/**
 * Function cancels adding a new trip
 */
async function cancelTrip() {
  const sectionSaveNewTrip = document.querySelector('#sectionSaveNewTrip');
  sectionSaveNewTrip.style.display = 'none';

  const sectionSearchDestination = document.querySelector(
    '#sectionSearchDestination'
  );
  sectionSearchDestination.style.display = 'block';

  const destinationInput = document.querySelector('#destinationInput');
  destinationInput.value = '';
}

/**
 * When the + add trip button is clicked, window will scroll down to the add trip section
 */
function searchAndSave() {
  const searchAndSaveSection = document.querySelector('#searchAndSaveSection');
  const y =
    searchAndSaveSection.getBoundingClientRect().top + window.pageYOffset;
  window.scrollTo({
    top: y,
    behavior: 'smooth'
  });
  const destinationInput = document.querySelector('#destinationInput');
  destinationInput.select();
}

// eslint-disable-next-line node/no-unsupported-features/es-syntax
export {
  // eslint-disable-next-line import/prefer-default-export
  saveTrip,
  cancelTrip,
  searchAndSave,
  getUpcomingTripsBrowser
};
