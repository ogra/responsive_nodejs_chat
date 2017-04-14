var mongo = require('mongodb').MongoClient;

exports.mongolizer = function(mongodb_connection_string, io, socket, users, clients, storage, rooms, allClients) {
    socket.join(rooms.room);// maybe important ???
/// Get room url
    socket.on('roomURL', function (data) {
        rooms = {room: data};
    });
////Mongodb connection//////
    mongo.connect(mongodb_connection_string, function (err, db) {
        socket.on('roomValidation', function (room) {
            checkifCollectionExists(db, room, 'foundValideRoom');
        });
        socket.on('infoFirstTimeVisit', function (room) {
            checkifCollectionExists(db, room, 'infoFirstTimeVisit');
        });
        outputAllMessages(db);
        socket.on('userinput', function (data) {
            var collection = db.collection('Room_' + data.url);
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
                collection.insert({
                    date: date,
                    name: name,
                    message: message,
                    avatar: avatar,
                    roomID: data.url,
                    userID: clients[socket.Id].id
                }, function () {
                    console.log(name + ' inserted a message into db ');
                    io.to(data.url).emit('output', data);/// broadcast to writer and viewer
                    //Send status to current client
                    sendStatus({
                        message: 'Message sent!',
                        clear: true
                    });
                });
            }
        });
    });//End mongodb connection

    /// socket disconnect ///
    socket.on('disconnect', function () {
        delete clients[socket.Id].id;
    });

    /// Functions ///
    function outputAllMessages(db) {
        var collection = db.collection('Room_' + rooms.room);
        collection.find().limit(50).sort({date: 1}).toArray(function (err, res) {
            if (err) {
                sendStatus('Error fetching messages. ' + err.message);
            }
            socket.on('storage', function (storage_data) {
                for (var x = 0; x < res.length; x += 1) {
                    var output = {
                        date: res[x].date,
                        name: res[x].name,
                        message: res[x].message,
                        avatar: res[x].avatar
                    };
                    socket.emit('output-all', output, storage_data);
                }
            });//end socket.on ('storage'...)
        });
    }

    function checkifCollectionExists(db, room, socketName) {
        var collectionNew = db.collection('Room_' + room);
        collectionNew.find().limit(2).sort({date: 1}).toArray(function (err, res) {
            if (err) {
                sendStatus('Error fetching messages. ' + err.message);
            }
            var output = {validRoom: res.length >= 1, roomCode: room};
            socket.emit(socketName, output);
        });
    }

    function sendStatus(s) {
        socket.emit('status', s);
    }

};