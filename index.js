// Referenced from https://socket.io/get-started/chat/
var express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);

//var cookie = require('cookie');
//var cookieParser = require('cookie-parser');

var currenttime;
users = [];
connections = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/styles.css', function(req, res){
  res.sendFile(__dirname + '/styles.css');
});

app.use(cookieParser());

io.on('connection', function(socket){
    currenttime = currentTime();    // get the current time
});

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s user(s) connected', connections.length);
    
    // Disconnect
    socket.on('disconnect', function(data){
        if(!socket.username){
            return;
        }
        users.splice(users.indexOf(socket.username), 1);
        update();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s user(s) remaining', connections.length);
    });
    
    // Send message on socket
    socket.on('send message', function(data){
        io.emit('new message', {msg: data, user: socket.username, currenttime});
    });
    
    // First time user
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        update();
    });
    
    function update(){
        io.sockets.emit('get users', users);
    }
});

// Port listen
http.listen(3000, function(){
  console.log('listening on port:3000');
});

function currentTime(){
  var date = new Date();
  var hour = date.getHours();
  var minute = date.getMinutes();

  if(minute < 10){
    minute = "0" + minute;    // case when minute is 0 - 9, we want to make it like 01, 02, 03, etc
  }
  var result = hour + ":" + minute + " ";
  return result
}


