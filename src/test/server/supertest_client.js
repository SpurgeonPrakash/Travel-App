const server = require('./supertest_server');

const port = 3000;

server.listen(port, function() {
  // eslint-disable-next-line no-console
  console.log('Server running on port %d', port);
});
