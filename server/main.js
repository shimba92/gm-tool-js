/**
 * Created by niennd on 6/29/2015.
 */


// Declare variables

var express = require('express'),
  app = express(),
  server = require('http').Server(app),
  io = require('socket.io')(server),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  morgan = require('morgan'),
  config = require('./config/config'),
  port = process.env.PORT || 9669,
  path = require('path'),
  webzocket = require('./network/webzocket'),
  // Model
  User = require('./models/user'),
  globalVar = require('./globalVar');

socket = require('./network/socket');
globalVar.io = io;

console.log('All variables are declared.');

// Configuration
mongoose.set('debug', true);
mongoose.connect(config.mongoLabURI);
mongoose.connection.on('error', function() {
  console.log('Mongoose connection error');
});
mongoose.connection.once('open', function callback() {
  console.log("Mongoose connected to the database");
  require('./utils').initUserData();
  console.log('init user data ...')
});

app.set('secretKey', config.secretKey);
console.log('path:' + path.join(__dirname, '../app'));
app.use('/', express.static(path.join(__dirname, '../app')));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(morgan('dev'));

// setup socket.io server
io.on('connection', webzocket);

require('./route/routes')(app);

server.listen(port, function() {
  console.log('HTTP server listening on port: %s, in %s mode', port, app.get('env'));
});
