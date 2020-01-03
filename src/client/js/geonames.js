/* eslint-disable node/no-unsupported-features/es-syntax */
// TODO write test
/**
 * Request geonames data from server.
 * @param {string} url API url
 * @param {Object} destination destination
 * @param {string} destination.name place name
 * @return {Array<{toponymName: string, countryName: string, lng: number, lat: number}>} possiblePlaces, array with objects containing geoname data
 */
async function requestGeonamesData(destination = {}) {
  let possiblePlaces = {};
  const url = 'http://localhost:8081/geonames';
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(destination)
  });
  try {
    possiblePlaces = await response.json();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e.toString());
  }
  return possiblePlaces;
}

/**
 * Function creates a dropdown list that shows all possible destinations,
 * triggered by (search) button click event.
 * Section save new trip becomes visible.
 * Section search for new trip becomes hidden.
 * @param {*} event
 */
async function getGeonames(event) {
  event.preventDefault();
  const destinationInput = document.getElementById('destinationInput').value;
  const geonames = await requestGeonamesData({ name: destinationInput });
  try {
    // deleting old entries of dropdown list
    const select = document.querySelector('#placelist');
    while (select.firstChild) {
      select.firstChild.remove();
    }

    // adding new places to dropdown list
    const frag = document.createDocumentFragment();
    let counter = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const place of geonames) {
      frag.appendChild(
        new Option(`${place.toponymName}, ${place.countryName}`, counter)
      );
      counter += 1;
    }
    select.appendChild(frag);

    // after the user searched for a possible destination, dropdown list becomes visible
    const sectionSaveNewTrip = document.querySelector('#sectionSaveNewTrip');
    sectionSaveNewTrip.style.display = 'block';

    const sectionSearchDestination = document.querySelector(
      '#sectionSearchDestination'
    );
    sectionSearchDestination.style.display = 'none';
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e.toString());
  }
}

export {
  // eslint-disable-next-line import/prefer-default-export
  getGeonames,
  requestGeonamesData
};
