var cmd = require('./command/cmd')

function dispatch(response) {
  switch (response.cmdId) {
    default:
      console.log('[-] Need implement this cmd: ' + response.cmdId);
  }
}

module.exports = dispatch;
