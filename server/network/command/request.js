var makeRequestPacket = require('zocket/network/packet').makeRequestPacket;
var cmd = require('./cmd');

module.exports = {
  requestLogin: function() {
    return makeRequestPacket(cmd.LOGIN, function() {
      this.writeString('thacdu');
    });
  },

  requestGeneralAction: function(wsUID, actionID, paramList) {
    return makeRequestPacket(cmd.DO_GENERAL_ACTION, function() {
      this.writeString(wsUID);
      this.writeInt(actionID);
      this.writeInt(paramList.length);
      for (var i in paramList) {
        this.writeString(paramList[i]+'');
      }
    })
  }
}
