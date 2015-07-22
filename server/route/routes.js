/**
 * Created by niennd on 7/10/2015.
 */
module.exports = function (app) {
    var user = require('./users');

    app.all('*', function(req, res, next) {
        res.set('Access-Control-Allow-Origin', 'http://localhost:9000');
        res.set('Access-Control-Allow-Credentials', true);
        res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
        res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
        if ('OPTIONS' == req.method) return res.send(200);
        next();
    });

    app.use('/api/authentication', user.authenticate);
    app.use('/api/add-user', user.addUser);
    app.use('/api/config-roles', user.roles);
    app.use('/api/users', user.getUsers);
    app.use('/api/delete-user/:uid', user.deleteUser);
    app.use('/api/logout', user.logout);
}