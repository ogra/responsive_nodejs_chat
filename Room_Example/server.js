var express = require('express');
var app = express();
var http = require('http').Server(app);
var url = require('url');
var io = require('socket.io')(http);
var mongoChat = require('./app/mongoChat');

var users = {},
    clients = {},
    dbName = 'nodejschat',
    allClients = [],
    storage = [],//check if is set session.storage//
    room = {},
    rooms = {};


//// LOCAL IP/PORT!
const ipaddress = "127.0.0.1";
const port = 3000;

//// LOCAL MONGODB_DB_URL ////
const mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + dbName;


app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile('index.html', {"root": __dirname});
});

app.get('/:id', function (req, res) {
    rooms = {room: req.params.id};
    res.sendFile('public/room.html', {"root": __dirname});
});

//// OPENSHIFT SOCKET CONNECTION ////
//var socket = io.connect('http://yourapp.rhcloud.com:8000/',{'forceNew':true });

io.on('connection', function (socket) {
    socket.Id = socket.client.id;
    clients[socket.Id] = socket;

    ///Mongolizer///
    mongoChat.mongolizer(mongodb_connection_string, io, socket, users, clients, storage, rooms, allClients);

}); // END io.on(connection...)

http.listen(port, ipaddress, function () {
    console.log((new Date()) + ' Server is listening on port' + port);
});