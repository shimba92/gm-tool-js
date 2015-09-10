var zocket = require('./socket');
var zocketCmd = require('./command/cmd');
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
  uID = response.uId;
  connection = globalVar.io.sockets.connected[uID];

  if (connection) {
    stdCmd = getMapCmdID()[response.cmdId];

    if ( stdCmd == undefined) {
      console.log('- Missing mapping for CmdID = ' + response.cmdId);
      return;
    }

    msg = createWSResponse(uID, stdCmd, {success: true, msg: response.json });
    connection.emit('action:log', msg);
    connection.emit('action:info', msg);
  } else {
    console.log('- Not exist WS UserID = ' + uID);
  }
}

function getMapCmdID() {
  map = {};
  for ( var key in zocketCmd ) {
    if ( CmdDefine.hasOwnProperty(key) ) {
      map[zocketCmd[key]] = CmdDefine[key];
    }
  }
  return map;
}

var CmdDefine = {
  CONNECT: 1,
  DISCONNECT: 2,

  GET_ACC_OBJECT:10
}

module.exports.CmdDefine = CmdDefine;
module.exports.createWSResponse = createWSResponse;
module.exports.parseWSRequest = parseWSRequest;
module.exports.dispatchMsgByUID = dispatchMsgByUID;
module.exports.getMapCmdID = getMapCmdID;


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
      case CmdDefine.GET_ACC_OBJECT:
        zocket.send(packet.requestGetAccountObject(uID, 10001));
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
