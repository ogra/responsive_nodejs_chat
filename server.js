//var mongo = require('mongodb').MongoClient;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
<<<<<<< HEAD
var mongoChat = require('./app/mongo_chat');

var ip = "127.0.0.1";
var port = 3000;

//var users = [];
=======
>>>>>>> 53875ef27cb1ae09f6f0496b5371d63e1a89f68f
var users = {};
var WhisperChek = false;

var clients = {};
var clientsID = {};

//check if is set session.storage
var storage = [];

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendfile('index.html');

});


//Mongodb connection
//mongo.connect('mongodb://127.0.0.1/chat', function (err, db) {
//    if (err) {
//        throw err;
//    }

    //socket connection
    io.on('connection', function (socket) {

        socket.Id = socket.client.id;
        clients[socket.Id] = socket;
        console.log('Someone connected! - ' + clients[socket.Id].id);


<<<<<<< HEAD
        mongoChat.mognolizer(io,socket, users, WhisperChek);


//        var collection = db.collection('messages');
//
//
//
//
////Output all messages
////
//        collection.find().limit(50).sort({date: 1}).toArray(function (err, res) {
//            if (err) {
//                sendStatus('Error fetching messages.');
//            }
//
//            socket.on('storage', function (storage_data) {
//
//                console.log(storage_data);
//
//                for (var x = 0; x < res.length; x += 1) {
//                    //console.log(res[x].name);
//
//                    var output = {
//                        date: res[x].date,
//                        name: res[x].name,
//                        message: res[x].message,
//                        avatar: res[x].avatar
//                    };
//
//
//                    //console.log(output);
//                    socket.emit('output-all', output, storage_data);
//
//                }
//
//            });//end socket.on ('storage'...)
//
//        });
//
//// NICKNAME
//
//        socket.on('nickname', function (data) {
//            socket.Username = data;
//            users[socket.Username] = socket;
//            updateNicknames();
//        });
//
////  WHISPER
//        socket.on("whisper", function (data, msg, whisperStatus) {
//
//            if (!whisperStatus) {
//                console.log("stopped whispering with: " + data);
//                delete users[socket.whisper];
//            } else if (data.length && whisperStatus) {
//                socket.whisper = data;
////                users[socket.whisper] = socket;
//                console.log("whisper" + users[socket.whisper] + data);
//                WhisperChek = true;
//
//                socket.emit('output', [data], [msg], WhisperChek);
//
//                users[socket.whisper].emit('output', [data], [msg], WhisperChek);
//
//            }
//        });
//
//// Functions
//        function sendStatus(s) {
//            socket.emit('status', s);
//        };
//
        function updateNicknames() {
            io.emit('nickname', Object.keys(users));
        }
//
//
////Wait for input from frontend for name and message
//        socket.on('userinput', function (data) {
//            var name = data.name,
//                message = data.message,
//                whitespacePattern = /^\s*$/,
//                date = data.date,
//                avatar = data.avatar;
//
//
//            if (whitespacePattern.test(name) || whitespacePattern.test(message)) {
//                console.log('Invalid! Cannot insert empty string.');
//                sendStatus('Did you choose a USERNAME or typed in a MESSAGE yet?');
//
//            }
//            else {
//
//                collection.insert({date: date, name: name, message: message, avatar: avatar}, function () {
//                    console.log(data.name + ' inserted a message into db');
//
////          //Emit latest messages to all Clients
////          io.sockets.broadcast.emit('output', [data]);
//
//
//                    io.sockets.emit('output', data, WhisperChek);
//
//                    //Send status to current client
//                    sendStatus({
//                        message: 'Message sent!',
//                        clear: true
//                    });
//                });
//            }
//
//        });
=======
//Output all messages
        collection.find().limit(50).sort({date: 1}).toArray(function (err, res) {
            if (err) {
                sendStatus('Error fetching messages.');
            }

            socket.on('storage', function (storage_data) {

                console.log(storage_data);

                for (var x = 0; x < res.length; x += 1) {
                    //console.log(res[x].name);

                    var output = {
                        date: res[x].date,
                        name: res[x].name,
                        message: res[x].message,
                        avatar: res[x].avatar
                    };

                    //console.log(output);
                    socket.emit('output-all', output, storage_data);

                }

            });//end socket.on ('storage'...)

        });

// NICKNAME
        socket.on('nickname', function (data) {
            socket.Username = data;
            users[socket.Username] = socket;
            updateNicknames();
        });

//  WHISPER
        socket.on("whisper", function (data) {

            if (!data.whisperStatus) {
                console.log("stopped whispering with: " + data);
                delete users[socket.whisper];

            } else if (data.whisperToName.length && data.whisperStatus) {

                socket.whisper = data.whisperToName;

                clientsID['id'] = clients[socket.Id].id;

                socket.emit('output', data);

                users[socket.whisper].emit('output', data);

            }

        });

// Functions
        function sendStatus(s) {
            socket.emit('status', s);
        };

        function updateNicknames() {
            io.emit('nickname', Object.keys(users));
        };


//Wait for input from frontend for name and message
        socket.on('userinput', function (data) {
            var name = data.name,
                message = data.message,
                whitespacePattern = /^\s*$/,
                date = data.date,
                avatar = data.avatar;


            if (whitespacePattern.test(name) || whitespacePattern.test(message)) {
                console.log('Invalid! Cannot insert empty string.');
                sendStatus('Did you choose a USERNAME or typed in a MESSAGE yet?');

            }
            else {

                collection.insert({date: date, name: name, message: message, avatar: avatar}, function () {
                    console.log(data.Name + ' inserted a message into db');

                    io.sockets.emit('output', data, WhisperChek);

                    //Send status to current client
                    sendStatus({
                        message: 'Message sent!',
                        clear: true
                    });
                });
            }

        });
>>>>>>> 53875ef27cb1ae09f6f0496b5371d63e1a89f68f


//disconnect
        socket.on('disconnect', function (data) {
            delete clients[socket.Id];


            if (!socket.Username)return;
            delete users[socket.Username];

            if (!socket.whisper)return;
            delete users[socket.whisper];

            updateNicknames();
        });


    });


<<<<<<< HEAD
//});


http.listen(port,ip, function () {
=======
http.listen(3000, function () {
>>>>>>> 53875ef27cb1ae09f6f0496b5371d63e1a89f68f
    console.log('listening on *:3000');
});
