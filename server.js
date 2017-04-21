var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoChat = require('./app/mongo_chat');
var Monitor = require('icecast-monitor');
var monitor = new Monitor({
    host: 'localhost',
    port: 80000,
    user: 'admin',
    password: 'hackme'
});
var listenerCount = 0;
monitor.createFeed(function(err, feed) {
    if (err) throw err;

    // Handle wildcard events 
    feed.on('*', function(event, data, raw) {
        console.log(event, data, raw);
    });

    // Handle usual events 
    feed.on('mount.listeners', function(listeners, raw) {
        console.log(listeners, raw);
        listenerCount = listeners;
    });
});

var ip = "0.0.0.0";
var port = 3000;
var users = {};
var WhisperChek = false;
var storage=[];
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendfile('index.html');
});
app.get('/stats', function (req, res) {
    res.json({listeners: listenerCount});
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
