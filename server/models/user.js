/**
 * Created by niennd on 6/30/2015.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  role: String
});

// Bcrypt middleware on UserSchema
UserSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

//Password verification
UserSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(isMatch);
  });
};


module.exports = mongoose.model('User', UserSchema);
