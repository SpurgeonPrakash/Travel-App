/* eslint-disable no-undef */
/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import { requestGeonamesData } from '../geonames';
// eslint-disable-next-line node/no-unpublished-require
const fetch = require('jest-fetch-mock');

describe('testing api request geonames from client side', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('calls requestGeonamesData and returns data to me', () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        toponymName: 'Barcelona',
        countryName: 'Spain',
        lng: '2.15899',
        lat: '41.38879'
      })
    );

    // assert on the response
    requestGeonamesData({ destination: 'Barcelona' }).then(res => {
      expect(res).toEqual({
        toponymName: 'Barcelona',
        countryName: 'Spain',
        lng: '2.15899',
        lat: '41.38879'
      });
    });

    // assert on the times called and arguments given to fetch
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual('http://localhost:8081/geonames');
  });
});
