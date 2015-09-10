var makeResponsePacket = require('zocket/network/packet').makeResponsePacket;

var getResponsePacket = function(response, unpackFunc) {
  response.uId = response.readInt();
  return makeResponsePacket(response, unpackFunc);
}

module.exports = {
  getAccountObjectResponse: function(response) {
    return getResponsePacket(response, function() {
      this.json = this.readString();
    });
  }
}
