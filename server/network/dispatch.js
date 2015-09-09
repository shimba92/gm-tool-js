var cmd = require('./command/cmd')
var packet = require('./command/response')
var webzocket = require('./webzocket')

function dispatch(response) {
  switch (response.cmdId) {
    case cmd.GET_ACC_OBJECT:
      response = packet.getAccountObjectResponse(response);
      break;
    default:
      console.log('[-] Need implement this cmd: ' + response.cmdId);
  }
  webzocket.dispatchMsgByUID(response);
}

module.exports = dispatch;
