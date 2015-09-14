var makeRequestPacket = require('zocket/network/packet').makeRequestPacket;
var cmd = require('./cmd');

module.exports = {
  requestLogin: function() {
    return makeRequestPacket(cmd.LOGIN, function() {
      this.writeString('thacdu');
    });
  },

  requestGeneralAction: function(cmdID, wsUID, paramList) {
    return makeRequestPacket(cmdID, function() {
      this.writeString(wsUID);
      this.writeInt(paramList.length);
      for (var i in paramList) {
        this.writeString(paramList[i]);
      }
    })
  }
}
