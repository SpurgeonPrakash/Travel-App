/* eslint-disable node/no-unsupported-features/es-syntax */
// function requests geonames data
async function requestGeonamesData(url = '', data = {}) {
  let geonamesData = {};
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  try {
    geonamesData = await response.json();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e.toString());
  }
  return geonamesData;
}

// function creates a dropdown list that shows all possible destinations,
// after the user searched for a destination
// eslint-disable-next-line no-unused-vars
async function getGeonames(event) {
  event.preventDefault();

  const destinationInput = document.getElementById('destinationInput').value;
  const route = 'http://localhost:8081/geonames';

  const geonames = await requestGeonamesData(route, {
    destination: destinationInput,
  });
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
        new Option(`${place.toponymName}, ${place.countryName}`, counter),
      );
      counter += 1;
    }
    select.appendChild(frag);

    // after the user searched for a possible destination, dropdown list becomes visible
    const sectionSaveNewTrip = document.querySelector('#sectionSaveNewTrip');
    sectionSaveNewTrip.style.display = 'block';

    const sectionSearchDestination = document.querySelector('#sectionSearchDestination');
    sectionSearchDestination.style.display = 'none';
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e.toString());
  }
}

export {
  // eslint-disable-next-line import/prefer-default-export
  getGeonames,
  requestGeonamesData,
};
