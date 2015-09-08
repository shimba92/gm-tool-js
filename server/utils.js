/**
 * Created by niennd on 7/13/2015.
 */
function addUser(_name, _email, _password, _role) {
  var User = require('./models/user');

  User.findOne({
    email: _email
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      var userData = new User({
        name: _name,
        email: _email,
        password: _password,
        role: _role,
      });

      userData.save(function(err) {
        if (err) throw err;
        console.log('Create new user ' + _email + ' successfully. uID = ' + userData._id);
      });
    } else {
      console.log('User ' + _email + ' existed in DB.');
    }
  });
};

function deleteUserByID(_uID) {
  var User = require('./models/user');
  User.findByIdAndRemove(_uID, function(err, user) {
    if (err) throw err;
    console.log('User ' + user.email + ' is deleted successfully');
  });
};

function updateUserByID(_uID, _update) {
  var User = require('./models/user');
  User.findByIdAndUpdate(_uID, _update, function(err, user) {
    if (err) throw err;
    console.log('User ' + user.email + ' is updated successfully with ' + _update);
  });
}

module.exports.initUserData = function() {
  var config = require('./config/config');
  addUser('admin', 'admin@root.com', 'root', config.userRole.ADMIN.strValue);
  addUser('super-user-1', 'super_user_1@root.com', 'root', config.userRole.SUPER_USER_1.strValue);
  addUser('super-user-2', 'super_user_2@root.com', 'root', config.userRole.SUPER_USER_1.strValue);
};

module.exports.addUser = addUser;
module.exports.deleteUserByID = deleteUserByID;
module.exports.updateUserByID = updateUserByID;
