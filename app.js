var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var gameConditions = Array(Array(3), Array(3), Array(3));

function checkVictory(msg, id) {
  var cellNum = parseInt(msg.split(':')[0]);
  var rowNum = parseInt(msg.split(':')[1]);

  gameConditions[rowNum][cellNum] = id;

  for (var i = 0; i < 3; i++) {
    if (gameConditions[rowNum][i] !== id) {
      return;
    }
  }

  io.emit('victory', id);
}

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket) {
  io.emit('id', socket.id);
  socket.on('click', function(msg) {
    io.emit('click', msg);
    checkVictory(msg, socket.id);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
