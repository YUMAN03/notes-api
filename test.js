const http = require('http');

const server = http.createServer((req, res) => {
  res.end('Hello World');
});

server.listen(3000, () => {
  console.log('HTTP server running on http://localhost:3000');
});