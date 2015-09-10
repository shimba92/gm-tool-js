var makeRequestPacket = require('zocket/network/packet').makeRequestPacket;
var cmd = require('./cmd');

module.exports = {
  requestLogin: function() {
    return makeRequestPacket(cmd.LOGIN, function() {
      this.writeString('thacdu');
    });
  },

  requestGetAccountObject: function(wsUID, uId) {
    return makeRequestPacket(cmd.GET_ACC_OBJECT, function() {
      this.writeString(wsUID);
      this.writeInt(uId);
    });
  }
}
