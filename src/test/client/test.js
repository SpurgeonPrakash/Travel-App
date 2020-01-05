// /__tests__/connectivity/async-fetch.js

const fetchMock = require('fetch-mock');

import asyncFetch from '../../client/geonames';

describe('asyncFetch', () => {
  it('can fetch', async () => {
    fetchMock.get('http://fake.com', { hello: 'world' });

    const response = await asyncFetch('http://fake.com');
    const result = await response.json();

    expect(result.hello).toEqual('world');
  });

  xit('handles errors', async () => {});

  xit('displays a nicer error message if one is provided', async () => {});
});
