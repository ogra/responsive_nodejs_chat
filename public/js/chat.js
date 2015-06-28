$(function () {


    $('#clearmessages').on('click', function () {
        $('.messages').empty();
    });
//-----------------------------------------------
    $('#myModal').modal('toggle');

    //========================//
    //   SESSION STORAGE      //
    //======================//
    var storage = $.localStorage;

    //var name = $('.chat input[name="name"]'),
    //var date = new Date();
    var d = new Date();



    var D = d.toUTCString().replace('GMT', '');

    var name,
        recognizeUser = $('.recognize-user'),
        storageCheck = false,
        NicknameButton = $('#chatnamesavebutton'),
        html,
        htmlNickname,
        whisper,
        whisperTo = $('.whisper'),
        whisperStatus,
        whisperMsg = $('#whisperMsg'),
        textarea = $('.msg'),
        status = $('.chat-status span'),
        statusbox = $('.chat-status').hide(),
        statusOld = status.text(),
        $avatar = $('.text'),
        nickname_bool = false,
        messagesDiv = $('.messages');

    messagesDiv.css({display: 'block'});


    try {
        var socket = io.connect();
    } catch (e) {
        console.log('Could not connect to socket.');
    }

    if (socket !== undefined) {
        console.log('Ok!');


        var setStatus = function (s) {
            status.text(s);

            if (s !== statusOld) {
                var delay = setTimeout(function () {
                    setStatus(statusOld);
                    statusbox.hide();
                    clearInterval(delay);
                }, 3000);
            }
        };


        //================//
        //   //START//   //
        //==============//
        $('#preloader').show();

        //---check or init storage--//
        if (storage.isSet('name')) {
            console.log("storageKey: " + storage.get('name'));
            socket.emit('storage', true);

            recognizeUser.addClass('ui purple label animated bounceInLeft').html(
                " <div class='header'>" +
                "Welcome back!<br><br/>" +
                "<i class='user icon'></i><em>" + storage.get('name') + "</em>" +
                "</div>" +
                "<p><small></small></p>");

            setTimeout(function () {
                recognizeUser.removeClass(' animated bounceInLeft');
                recognizeUser.addClass('animated bounceOutLeft');

            }, 5000);

        } else {
            socket.emit('storage', false);

            $('.recognize-user').html('');

            recognizeUser.addClass('ui red label animated bounceInLeft').html(
                " <div class='header'>" +
                "Please choose a username first!" +
                "</div><p><small></small></p>");

            setTimeout(function () {
                recognizeUser.removeClass(' animated bounceInLeft');
                recognizeUser.addClass('animated bounceOutLeft');

            }, 5000);
        }

        //==== receive socket nickname==//
        socket.on('nickname', function (data) {
            console.log('online: ' + data);

            nick_name(data);

            //console.log(htmlNickname + data);

        });

        //==================//
        //  ALL OUTPUTS    //
        //================//
        socket.on('output-all', function (data, storage_data) {

            //check if storage_data ==true//
            storageData(storage_data);

            html =
                "<div class='comment animated bounceInDown'>" +
                "<p class='avatar'>" +
                dataAv(data.avatar) +
                " </p>" +
                "<div class='content'>" +
                "<a class='author'>" + dataN(data.name) + "</a>" +
                "<div class='metadata'>" +
                "<span class='date'> " + data.date + "</span>" +
                "</div>" +
                "<div class='text'><i class='comment icon'></i>  "

//                        + data.message +
            + dataM(data.message) +

            "</div>" +
            "<div class='actions'>" +
            "</div>" +
            "</div>" +
            "</div>";
            messagesDiv.prepend(html);

//                }

            $('#preloader').hide();



        });


        //=======================//
        // OUTPUT AFTER SUBMIT  //
        //=====================//
        socket.on('output', function (data, msg, WhisperCheck) {


            if (WhisperCheck) {

                html =
//                                "<div><p class='bg-primary Sim'><img class='img-circle avatarm' src='avatar/user3.png' alt='avater'><span class='bubblewhisper' style='color: #ffffff'> <em>whisperTo - " + data[i] + "</em>: " + msg[i] + "</span></p></div>";
                    "<div class='comment'>" +
                    "<a class='avatar'>" +
                        //dataAv(data.avatar) +
                    $avatar +

                    "</a>" +
                    "<div class='content'>" +
                    "<a class='author'>Matt</a>" +
                    "<div class='metadata'>" +
                    "<span class='date'>" + data.date + "</span>" +
                    "</div>" +
                    "<div class='text'>" +
                    "<em>whisperTo - "

                    + data.name + "</em>: " + data.message +

                    "</div>" +
                    "<div class='actions'>" +
                    "</div>" +
                    "</div>" +
                    "</div>"


                messagesDiv.prepend(html);

            }

            if (!WhisperCheck) {
//                    $('#chatnamesavebutton').css({"display": "block"});

                html =
                    "<div class='comment animated bounceInDown'>" +
                    "<p class='avatar'>" +
                    dataAv(data.avatar) +
                    " </p>" +
                    "<div class='content'>" +
                    "<a class='author'>" + dataN(data.name) + "</a>" +
                    "<div class='metadata'>" +
                    "<span class='date'> " + data.date + "</span>" +
                    "</div>" +
                    "<div class='text'><i class='comment icon'></i>  "

//                        + data.message +
                + dataM(data.message) +

                "</div>" +
                "<div class='actions'>" +
                "</div>" +
                "</div>" +
                "</div>";
                messagesDiv.prepend(html);
                $('#preloader').hide();

            }
        });

        //===============//
        // HELPER FUNC. //
        //=============//

        function dataM(dataM) {
            if (dataM === undefined) {
                dataM = 'Welcome!';
                return dataM;
            } else {
                return dataM;
            }
        }

        function dataN(dataN) {
            if (dataN === null) {
                dataN = '';
                return dataN;
            } else {
                return dataN;
            }
        }

        function dataAv(dataAv) {
            if (dataAv === undefined) {
                dataAv = 'noFace';
                return dataAv;
            } else {
                return dataAv;
            }
        }

        function nick_name(data) {
            htmlNickname = '';

            for (var i = 0; i < data.length; i++) {

                htmlNickname += "<li class='whoisonline'><i class='user icon' ></i> " + data[i] + "</li>";
                //whisper += "<option>" + data[i] + "</option>";

            }


            $(".username").html(htmlNickname);
            $(".whisper").html(whisper);

            htmlNickname = "";
            whisper = "";


        }

        function storageData(storage_data) {
            if (storage_data === true) {
                storageCheck = true;
                $('li.user').hide();
                $('#empty-storage').show();
            } else {
                $('li.user').show();
                $('#empty-storage').hide();
            }
        }


        //=======================//
        //    SUBMIT FORM       //
        //=====================//
        $('#submit').click(function (e) {
            e.preventDefault();

            var name = $('.chat');

            //====== storageCheck======//
            if (storageCheck === true) {

                name = storage.get('name');
                //$avatar = storage.get('avatar');
                //$('#empty-storage').show();


            } else {
                name = name.val();
                //$avatar = $avatar.html();

                name = storage.set('name', name);
                //storage.set('avatar', $avatar);

                $('#empty-storage').show();

            }
            console.log('name: ' + name + ' avatar: ' + $avatar + ' storageCheck: ' + storageCheck);


            socket.emit('nickname', name);
//                    name.val('');

            //console.log('avatar: ' + $avatar.html());

            //======Listen for status========//
            socket.on('status', function (data) {

                if (typeof data !== 'object') {
                    //data will be a string incase of error status
                    statusbox.show().removeClass("alert-success");
                    statusbox.show().addClass("alert-danger");
                    setStatus(data);
                }
                if (data.clear === true) {

                    $('li.user').hide('slow');
                    //$('li.li-avatar').hide();

                    textarea.val('');//clear textarea
                }

            });

            var d = new Date();
            var n = d.toLocaleDateString();
            var t= d.toLocaleTimeString();

            var date = n+' '+t;

            socket.emit('userinput',
                {

                    name: name,
                    message: textarea.val(),
                    //date: date.toUTCString().replace('GMT', ''),
                    //date:"Mon, 22 Jun 2015 17:24:00 ",
                    date: date,
                    avatar: $avatar.html()

                });

            //=== clear input===//
            $('#m').val('');


        });//end form


        //==================//
        //  RESET STORAGE  //
        //================//
        $('#empty-storage').click(function (e) {
            e.preventDefault();
            //storage.remove('name');
            storage.removeAll(true);
            storageCheck = false;
            $('li.user').show('slow');
            $(this).hide();
        });


        ////==== receive socket nickname==//
        //socket.on('nickname', function (data, nickname) {
        //    nickname_bool = nickname;
        //
        //
        //    nick_name(data);
        //
        //});

        //======Whisper=====//
        $('.whisperStop').on('click', function () {
            whisperStatus = false;
            socket.emit('whisper', whisperTo.val(), whisperStatus);
        });

        $('.whisperNow').on('click', function () {
            whisperStatus = true;
            socket.emit('whisper', whisperTo.val(), whisperMsg.val(), whisperStatus);
        });


    } //end socket


});// End ready
