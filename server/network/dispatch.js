var cmd = require('./command/cmd')
var packet = require('./command/response')
var webzocket = require('./webzocket')

function dispatch(response) {
  wsCmdID = webzocket.transformCmdID(response.cmdId);
  if ( wsCmdID != undefined) {
    response = packet.getGeneralActionResponse(response);
    webzocket.dispatchMsgByUID(response);
  } else {
    console.log('[-] Need implement this cmd: ' + response.cmdId);
  }
}

module.exports = dispatch;
