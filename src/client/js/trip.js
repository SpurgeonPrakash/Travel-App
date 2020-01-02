// POST route: save trip data to server
const saveTripServer = async (url = '', data = {}) => {
  let result = {};
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  try {
    result = await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Trip was not saved.', error);
  }
  return result;
};

// get upcoming trips saved on the server, data is enriched by countdown and temperature "forecast"
const getUpcomingTripsServer = async (url = '', data = {}) => {
  let result = {};
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  try {
    result = await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Trip was not deleted');
  }
  return result;
};

// helper function to delete future trip on the server
const deleteUpcomingTrip = async (url = '', data = {}) => {
  let result = {};
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  try {
    result = await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Trip was not deleted');
  }
  return result;
};

// paste upcoming trips into browser window
async function getUpcomingTripsBrowser() {
  const upcomingTrips = await getUpcomingTripsServer(
    'http://localhost:8081/futureTrips',
  );

  // no upcoming trips
  if (upcomingTrips.length === 0) {
    const commentUpcomingTrips = document.querySelector(
      '#commentUpcomingTrips',
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
      deleteUpcomingTrip('http://localhost:8081/deleteTrip', {
        id: tripId,
      }).then((id) => {
        section = document.querySelector(`#trip${id.deletedTripId}`);
        while (section.firstChild) {
          section.firstChild.remove();
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
    '#sectionSearchDestination',
  );
  sectionSearchDestination.style.display = 'block';

  const destinationInput = document.querySelector('#destinationInput');
  destinationInput.value = '';
}

// function saves a new trip, and rebuilds upcoming trip section
async function saveTrip() {
  // get new destination
  const select = document.getElementById('placelist');
  const selection = select.options[select.selectedIndex].value;

  // get new date
  const newDate = document.getElementById('newTripStart').value;

  await saveTripServer('http://localhost:8081/saveTrip', {
    index: selection,
    date: newDate,
  });
  getUpcomingTripsBrowser();
}

// function cancels adding a new trip
async function cancelTrip() {
  const sectionSaveNewTrip = document.querySelector('#sectionSaveNewTrip');
  sectionSaveNewTrip.style.display = 'none';

  const sectionSearchDestination = document.querySelector(
    '#sectionSearchDestination',
  );
  sectionSearchDestination.style.display = 'block';

  const destinationInput = document.querySelector('#destinationInput');
  destinationInput.value = '';
}

// when the + add trip button is clicked, window will scroll down to the add trip section
function searchAndSave() {
  const searchAndSaveSection = document.querySelector('#searchAndSaveSection');
  const y = searchAndSaveSection.getBoundingClientRect().top + window.pageYOffset;
  window.scrollTo({
    top: y,
    behavior: 'smooth',
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
  getUpcomingTripsBrowser,
};
