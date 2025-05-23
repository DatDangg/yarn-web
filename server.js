const path = require('path');
const jsonServer = require(path.resolve('./node_modules/json-server'));

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// CORS middleware thủ công
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // cho phép mọi origin
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

server.use(middlewares);
server.use(router);

server.listen(3001, () => {
  console.log('JSON Server is running at http://localhost:3001');
});
