/**
 * Created by niennd on 6/29/2015.
 */


// Declare variables

var express = require('express'),
    app = express(),

    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    config = require('./config/config'),
    portHttp = process.env.PORT || 9669,
    path = require('path'),
// Model
    User = require('./models/user');

console.log('All variables are declared.');

// Configuration
mongoose.set('debug', true);
mongoose.connect(config.mongoLocalURI);
mongoose.connection.on('error', function () {
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
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));

// root

require('./route/routes')(app);

require('http').createServer(app).listen(port, function () {
    console.log('HTTP server listening on port: %s, in %s mode', port, app.get('env'));
});
