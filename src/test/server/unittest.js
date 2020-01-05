/* eslint-disable node/no-unpublished-require */
/* eslint-disable import/no-extraneous-dependencies */
const request = require('supertest');
const test = require('tape');
const app = require('./supertest_server');

test('Testing server route /geonames', function(t) {
  request(app)
    .post('/geonames')
    .send(JSON.stringify({ name: 'Barcelona' }))
    .set('Content-Type', 'application/json')
    .expect(200)
    .end(function(err, res) {
      const expectedGeoname = {
        toponymName: 'Barcelona',
        countryName: 'Spain',
        lng: '2.15899',
        lat: '41.38879'
      };
      t.error(err, 'No error');
      t.same(res.body[0], expectedGeoname, '/geonames works as expected');
      t.end();
    });
});
