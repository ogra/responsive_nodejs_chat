var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoChat = require('./app/mongo_chat');

var ip = "127.0.0.1";
var port = 3000;
var users = {};
var WhisperChek = false;
var storage=[];
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendfile('index.html');
});
//socket connection
    io.on('connection', function (socket) {
        //console.log('Someone connected!');
        mongoChat.mognolizer(io,socket, users, WhisperChek);
        function updateNicknames() {
            io.emit('nickname', Object.keys(users));
        }
//disconnect socket
        socket.on('disconnect', function (data) {
            if (!socket.Username)return;
            delete users[socket.Username];
            updateNicknames();
        });
    });
http.listen(port,ip, function () {
    console.log('listening on *:3000');
});
