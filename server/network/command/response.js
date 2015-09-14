var makeResponsePacket = require('zocket/network/packet').makeResponsePacket;

var getResponsePacket = function(response, unpackFunc) {
  response.uId = response.readString();
  return makeResponsePacket(response, unpackFunc);
}

module.exports = {
  getGeneralActionResponse: function(response) {
    return getResponsePacket(response, function() {
      this.actionID = this.readInt();
      this.json = this.readString();
    });
  }
}
