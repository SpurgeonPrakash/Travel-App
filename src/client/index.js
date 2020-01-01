/* eslint-disable node/no-unsupported-features/es-syntax */
import { getGeonames } from './js/geonames';
import { saveTrip, getUpcomingTripsBrowser } from './js/trip';


import './styles/resets.scss';
import './styles/variables.scss';
import './styles/base.scss';
import './styles/header.scss';
import './styles/userform.scss';
import './styles/footer.scss';

document.getElementById('searchDestinationButton').addEventListener('click', getGeonames);
document.getElementById('saveTripButton').addEventListener('click', saveTrip);

getUpcomingTripsBrowser();

export { getGeonames, saveTrip };
