/* eslint-disable no-undef */
/* eslint-disable node/no-unsupported-features/es-syntax */
import { requestGeonamesData } from './geonames';

/* test if sentiment analysis works with a valid url */
test('Check', () => {
  const route = 'http://localhost:8081/geonames';
  const destination = { destination: 'London' };
  requestGeonamesData(route, destination)
    .then((geonames) => {
      expect(geonames[0].toponymName).toBe('Paris');
    });
});
