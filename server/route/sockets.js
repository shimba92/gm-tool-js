var config = require('../config/config');
var io_client = require('socket.io-client');

exports.setupConnection = function (req, res) {
    var ip = req.params.ip;
    var option = {
        reconnection: false,
        timeout: 5000 // milliseconds
    };
    var socket = io_client.connect(ip, option);
    console.log('connecting to ' + ip);
    socket.on('connect', function(){
        console.log('Connected!');
    });
    socket.on('connect_error', function(error){
        console.log('Connect Error!' + error);
    });
    socket.on('reconnect', function(nAttempt){
        console.log('Reconnect n = ' + nAttempt);
    });
    socket.on('disconnect', function(){
        console.log('Disconnected!');
    });

    res.json(ip);
}

exports.ipList = function (req, res) {
    res.json(config.servers);
}