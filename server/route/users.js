var User = require('../models/user'),
    jwt = require('jsonwebtoken'),
    path = require('path'),
    config = require('../config/config')

// authentication
exports.authenticate = function (req, res) {
    User.findOne(
        {email: req.body.email},
        function (err, user) {
            if (err) {
                res.send(err);
            }

            if (!user) {
                console.log('Authentication failed: No data user ' + req.body.email);
                res.json({success: false, msg: 'no-user-data'});
            } else {
                user.comparePassword(req.body.password, function (isMatch) {
                    if (!isMatch) {
                        console.log("Attempt failed to login with " + user.username);
                        return res.send(401);
                    } else {
                        var token = jwt.sign(
                            user._id,
                            config.secretKey,
                            {expiresInMinutes: 1000}
                        );
                        console.log('Authentication success. Token = ' + token);
                        res.json({success: true, msg: 'success', token: token, user: user});
                    }
                });
            }
        }
    );
}

exports.logout = function(req, res) {
    delete req.user;
    return res.send(200);
}

exports.getUsers = function (req, res) {
    User.find(function (err, users) {
        if (err) {
            res.send(err);
        }
        res.json(users);
    });
}

exports.deleteUser = function (req, res) {
    var _uID = req.params.uid;
    User.findByIdAndRemove(_uID, function (err, user) {
        if (err) {
            res.send(err);
        }
        console.log('User ' + user.email + ' is deleted successfully');

        User.find(function (err, users) {
            if (err) {
                res.send(err);
            }
            res.json(users);
        });
    });
}

exports.addUser = function (req, res) {
    var _email = req.body.email;
    var _name = req.body.name;
    var _password = req.body.password;
    var _role = req.body.role;
    User.findOne({email: _email}, function (err, user) {
        if (err) {
            res.send(err);
        }

        if (!user) {
            var userData = new User({
                name: _name,
                email: _email,
                password: _password,
                role: _role,
            });

            userData.save(function (err) {
                if (err) {
                    res.send(err);
                }
                console.log('Create new user ' + _email + ' successfully. uID = ' + userData._id);
                res.json({success: true, uID: userData._id});
            });
        } else {
            console.log('User ' + _email + ' existed in DB.');
            res.json({success: false, uID: user._id});
        }
    });
}

exports.roles = function (req, res) {
    res.json(config.userRole);
}

exports.ipList = function (req, res) {
    res.json(config.servers);
}
