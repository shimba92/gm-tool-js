var zocket = require('./socket');
var packet = require('./command/request');
var globalVar = require('../globalVar');

function createWSResponse(uID, cmdID, result) {
  return {
    uID: uID,
    cmdID: cmdID,
    result: result
  };
}

function parseWSRequest(data) {
  return {
    uID: data.uID,
    cmdID: data.cmdID,
    paramsList: data.paramList
  };
}

function dispatchMsgByUID(response) {
  connection = globalVar.io.sockets.connected[socketid];
  if (connection) {
    msg = createWSResponse(response.uID, response.cmdId, response.json);
    connection.emit('action:log', msg);
    connection.emit('action:info', msg);
  }
}

var CmdDefine = {
  CONNECT: 1,
  DISCONNECT: 2,
  GET_USER_INFO:10
}

module.exports.CmdDefine = CmdDefine;
module.exports.createWSResponse = createWSResponse;
module.exports.parseWSRequest = parseWSRequest;
module.exports.dispatchMsgByUID = dispatchMsgByUID;


module.exports = function(socket) {
  var uID = socket.id;

  console.log('User-' + uID + ' connected');
  // on connection
  socket.emit('init', createWSResponse(uID, CmdDefine.CONNECT, {
    success: true,
    msg: 'Connect to websocket successfully!'
  }));

  socket.on('action:request', function(data) {
    request = parseWSRequest(data.request);

    switch (request.cmdID) {
      case CmdDefine.GET_USER_INFO:
        zocket.send(packet.requestGetAccountObject());
        break;
      default:

    }

    socket.emit('action:log', createWSResponse(request.uID, request.cmdID, {
      success: true,
      msg: 'received request'
    }));
  });

  socket.on('disconnect', function() {
    console.log('User : ' + uID + ' disconnected');
    socket.emit('action:log', createWSResponse(uID, CmdDefine.DISCONNECT, {
      success: true,
      msg: 'User disconnect'
    }))
  });
}
