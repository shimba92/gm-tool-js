var Client = require('zocket');
var request = require('./command/request')
var dispatch = require('./dispatch')
var config = require('../config/config').servers.private;

var client = new Client(config.host, config.port);
client.login = function() {
  this.send(request.requestLogin());
}

client.setDispatch(dispatch)
client.start();

module.exports = client
