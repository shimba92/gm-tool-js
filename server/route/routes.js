/**
 * Created by niennd on 7/10/2015.
 */
module.exports = function (app) {
    var user = require('./users');
    var socket = require('./sockets');
    var token_manager = require('../config/token_manager');
    var jwt = require('express-jwt');
    var path = require('path');

    app.all('*', function(req, res, next) {
        res.set('Access-Control-Allow-Origin', 'http://localhost:9000');
        res.set('Access-Control-Allow-Credentials', true);
        res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
        res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
        if ('OPTIONS' == req.method) return res.send(200);
        next();
    });

    app.get('/', function(req, res) {
        res.sendFile(path.resolve('app/index.html'));
    });

    app.use('/api/authentication', user.authenticate);
    app.use('/api/logout', user.logout);

    app.use('/api/config-roles', user.roles);

    app.use('/api/add-user',jwt({secret: app.get('secretKey')}), token_manager.verifyToken, user.addUser);
    app.use('/api/users',jwt({secret: app.get('secretKey')}), token_manager.verifyToken, user.getUsers);
    app.use('/api/delete-user/:uid',jwt({secret: app.get('secretKey')}), token_manager.verifyToken, user.deleteUser);
    app.use('/api/socket-connect/:ip',jwt({secret: app.get('secretKey')}), token_manager.verifyToken, socket.setupConnection);
    app.use('/api/ip-list', token_manager.verifyToken, socket.ipList);
}
