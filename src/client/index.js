/* eslint-disable node/no-unsupported-features/es-syntax */
import { getGeonames } from './js/geonames';
import {
  saveTrip,
  cancelTrip,
  searchAndSave,
  getUpcomingTripsBrowser
} from './js/trip';

import './styles/resets.scss';
import './styles/variables.scss';
import './styles/base.scss';
import './styles/header.scss';
import './styles/user_general.scss';
import './styles/user_upcomingTrips.scss';
import './styles/user_search.scss';
import './styles/footer.scss';

document
  .getElementById('searchDestinationButton')
  .addEventListener('click', getGeonames);
document.getElementById('saveTripButton').addEventListener('click', saveTrip);
document
  .getElementById('cancelTripButton')
  .addEventListener('click', cancelTrip);
document
  .getElementById('scrollToAddTripButton')
  .addEventListener('click', searchAndSave);
const dummyDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);
document.getElementById('newTripStart').value = dummyDate;

getUpcomingTripsBrowser();

export { getGeonames, saveTrip, cancelTrip, searchAndSave };
