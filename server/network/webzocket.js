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
};

function dispatchMsgByUID(response) {
  uID = response.uId;
  connection = globalVar.io.sockets.connected[uID];

  if (connection) {
    wsCmd = transformCmdID(response.cmdId);

    if (wsCmd == undefined) {
      console.log('- Missing mapping for CmdID = ' + response.cmdId);
      return;
    }

    msg = createWSResponse(uID, wsCmd, {
      success: response.error === 0,
      msg: response.json
    });

    switch (wsCmd) {
      case CmdDefine.DO_GENERAL_ACTION:
        msg.extraInfo = 'actionId = ' + response.actionID;
        connection.emit('action:info', msg);
        break;
      default:
        msg.extraInfo = 'No View';
    }
    connection.emit('log', msg);
  } else {
    console.log('- Not exist WS UserID = ' + uID);
  }
};

var transformCmdID = function(cmdID) {
  map = {};
  for (var key in zocketCmd) {
    if (CmdDefine.hasOwnProperty(key)) {
      map[zocketCmd[key]] = CmdDefine[key];
    }
  }
  return map[cmdID];
};

var revertCmdID = function(cmdID) {
  map = {};
  for (var key in zocketCmd) {
    if (CmdDefine.hasOwnProperty(key)) {
      map[CmdDefine[key]] = zocketCmd[key];
    }
  }
  return map[cmdID];
};

var CmdDefine = {
  CONNECT: 1,
  DISCONNECT: 2,

  DO_GENERAL_ACTION: 10
};

var ActionDefine = {
  GET_USER_INFO: 1,
  UPDATE_USER_INFO: 2
}

module.exports.CmdDefine = CmdDefine;
module.exports.transformCmdID = transformCmdID;
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
    paramList = data.paramList;
    actionID = data.actionID;
    if (actionID === undefined) {
      socket.emit('log', 'action undefined');
      return;
    } else {
      zocket.send(packet.requestGeneralAction(uID, actionID, paramList));
      socket.emit('log', 'received request');
    }
  });

  socket.on('disconnect', function() {
    console.log('User : ' + uID + ' disconnected');
    socket.emit('log', createWSResponse(uID, CmdDefine.DISCONNECT, {
      success: true,
      msg: 'User disconnect'
    }))
  });
}
