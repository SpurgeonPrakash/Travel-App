/* eslint-disable import/prefer-default-export */
/* eslint-disable node/no-unsupported-features/es-syntax */
export function APIRequest(who) {
  if (who === 'geonames') {
    return fetch('http://localhost:8081/geonames').then(res => res.json());
  }
  return 'no argument provided';
}
