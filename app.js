
require('dotenv').config();

var indexRouter = require('./routes/index.js');
var dataRouter = require('./routes/data.js');
const { auth } = require('express-openid-connect');
var { app, server, auth0config, fixturesCollection, playersCollection } = require('./config.js');
var { getFixtures, getPlayers } = require('./firebase.js');
const { jsonParser, urlencodedParser, staticMiddleware } = require('./middleware.js');

// Cache for players data
let playerCache = null;
let fixtureCache = null;


app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(jsonParser);
app.use(urlencodedParser);
app.use(staticMiddleware);

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(auth0config));

app.get('/', (req, res) => {
  res.redirect('/table');
});

app.use('/', indexRouter);
app.use('/data', dataRouter);

const port = process.env.PORT || 3000;
server = app.listen(port, () => {
  console.log(`Express is running on port ${port}`);
});

// Connect to socket.io
const io = require('socket.io')(server);
io.on('connection', (socket) => {
  console.log('Client connected');
  if (playerCache) {
    socket.emit('playersUpdate', playerCache);
  }
  if (fixtureCache) {
    socket.emit('fixturesUpdate', fixtureCache);
  }
});

// Function to update player cache and emit changes
updatePlayerCacheAndEmit = async () => {
  playerCache = await getPlayers();
  io.emit('playersUpdate', playerCache);
};

// Function to update player cache and emit changes
updateFixtureCacheAndEmit = async () => {
  fixtureCache = await getFixtures();
  io.emit('fixturesUpdate', fixtureCache);
};

// Listen for changes in collections
fixturesCollection.onSnapshot(updateFixtureCacheAndEmit);
playersCollection.onSnapshot(updatePlayerCacheAndEmit);

// Trigger initial cache update on startup
updatePlayerCacheAndEmit();
updateFixtureCacheAndEmit();

