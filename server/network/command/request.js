var makeRequestPacket = require('zocket/network/packet').makeRequestPacket;
var cmd = require('./cmd');

module.exports = {
  requestLogin: function() {
    return makeRequestPacket(cmd.LOGIN, function() {
      this.writeString('thacdu');
    });
  }
}
