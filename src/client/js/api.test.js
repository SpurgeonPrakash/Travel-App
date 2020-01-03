/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable node/no-unsupported-features/es-syntax */
import { APIRequest } from './api';
import { requestGeonamesData } from './geonames';

describe('testing api', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('calls geonames and returns names to me', () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        toponymName: 'Barcelona',
        countryName: 'Spain',
        lng: '2.15899',
        lat: '41.38879'
      })
    );

    fetch.mockResponse(() =>
      requestGeonamesData({ name: 'Barcelona' }).then(res => ({
        body: {
          toponymName: 'Barcelona',
          countryName: 'Spain',
          lng: '2.15899',
          lat: '41.38879'
        }
      }))
    );

    // assert on the response
    APIRequest('geonames').then(res => {
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
