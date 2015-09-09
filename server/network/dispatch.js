var cmd = require('./command/cmd')
var packet = require('./command/response')

function dispatch(response) {
  switch (response.cmdId) {
    case cmd.GET_ACC_OBJECT:
      response = packet.getAccountObjectResponse(response);
      // send to client
      break;
    default:
      console.log('[-] Need implement this cmd: ' + response.cmdId);
  }
}

module.exports = dispatch;
