$(function () {


//-----------------------------------------------

    //========================//
    //   SESSION STORAGE      //
    //======================//
    var storage = $.localStorage;

    //var d = new Date();

    //var D = d.toUTCString().replace('GMT', '');

    var name,
        recognizeUser = $('.recognize-user'),
        storageCheck = false,
        //NicknameButton = $('#chatnamesavebutton'),
        html,
        htmlNickname,
        whisper,
        whisper_button = $('#whisper_button'),
        whisperToName,
        whisperTo = $('.whisper'),
        whisperStatus = false,
        whisperMsg = $('#whisperMsg'),
        textarea = $('.msg'),
        status = $('.chat-status span'),
        statusbox = $('.chat-status').hide(),
        statusOld = status.text(),
        $avatar = $('.text'),
        //nickname_bool = false,
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

        //==================//
        //  ALL OUTPUTS    //
        //================//
        socket.on('output-all', function (data, storage_data) {

            //check if storage_data ==true//
            storageData(storage_data);

//                    $('#chatnamesavebutton').css({"display": "block"});
//                for (var i = 0; i < data.length; i++) {
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


        //===============================//
        //    RECEIVE SOCKET NICKNAME   //
        //==============================//
        socket.on('nickname', function (data) {

            nick_name(data);


            $('#whisper_button_first_view').on('click', function () {
                $(this).hide('fast');
                $('#whisperTo').show('slow');
            });

            $('#whisperTo').on({
                mouseup: function (e) {
                    e.preventDefault();
                    //console.log('whisperName');
                    $('#submit').hide('fast');
                    whisper_button.show('slow');
                    $('#whisperStop').show('slow');

                    $(this).css({'background': '#464545', 'color': 'white'});
                    $('.ui.form textarea, .ui.textarea').css({'background': '#464545', 'color': 'white'});

                    //whisperToName = $(this).find($('.whisperName').text());
                    whisperToName = $(this).val();

                    //console.log('onUP: '+data+' whisperToName - '+whisperToName);

                }, change: function (e) {
                    e.preventDefault();
                    whisperToName = $(this).val();
                    //console.log('onCHANGE: '+data+' whisperToName - '+whisperToName);

                }
            });

        });
             //end socke.onNickname

        //==================//
        // Stop Whispering    //
        //================//

        $('#whisperStop').on('click', function (e) {
            e.preventDefault();
            console.log('whisperStop');
            $(this).hide('fast');
            $('#whisper_button').hide('fast');
            $('#submit').show('slow');

            $('#whisperTo').hide('fast');
            $('#whisper_button_first_view').show('slow');
            //$('#whisperTo').css({'background': 'white', 'color': 'rgba(0, 0, 0, .8)'});

            $('.ui.form textarea, .ui.textarea').css({'background': 'white', 'color': 'rgba(0, 0, 0, .8)'});

            whisperStatus = false;
            socket.emit('whisper',

                {

                    whisperToName: whisperToName,
                    msg: textarea.val(),
                    //date: date,
                    whisperStatus: whisperStatus

                });

        });

        $('#whisper_button').on('click', function (e) {
            e.preventDefault();
            console.log('whisper');
            whisperStatus = true;
            //socket.emit('whisper', whisperTo.val(), whisperMsg.val(), whisperStatus);
            var whisperFromName = storage.get('name');


            var d = new Date();
            var n = d.toLocaleDateString();
            var t = d.toLocaleTimeString();

            var date = n + ' ' + t;

            socket.emit('whisper',

                {

                    whisperToName: whisperToName,
                    whisperFromName: whisperFromName,
                    msg: textarea.val(),
                    date: date,
                    whisperStatus: whisperStatus,
                    avatar: $avatar.html()


                });

            textarea.val('');


        });


        //=======================//
        // OUTPUT AFTER SUBMIT  //
        //=====================//
        socket.on('output', function (data) {

            console.log('wcheck: ' + data.whisperStatus);

            if (data.whisperStatus) {


                console.log(data.date + ' - ' + data.whisperToName);

                html =


                    "<div class='comment animated bounceInDown'>" +
                    "<p class='avatar'>" +
                    dataAv(data.avatar) +
                    "</p>" +
                    "<div class='content'>" +
                    "<a class='author'>" + data.whisperFromName + "</a>" +
                    "<div class='metadata'>" +
                    "<span class='date'> " + data.date + "</span>" +
                    "</div>" +
                    "<br/>" +
                    "<p class='author' style='font-weight: 300'> <i class='spy icon'> </i> " + data.whisperToName + "</p>" +

                    "<div class='text' style='color: #a6373c'>" +
                        //"<i class='spy icon'> </i> "
                    "<i class='comment icon'></i>  "

                    + data.msg +

                "</div>" +
                "<div class='actions'>" +
                "</div>" +
                "</div>" +
                "</div>";

                messagesDiv.prepend(html);

            }

            if (!data.whisperStatus) {

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

        function Whisper(dataW) {
            for (var wsp = 0; wsp < dataW.length; wsp += 1) {
                return dataW[wsp];
            }
        }

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
                dataAv = '';
                return dataAv;
            } else {
                return dataAv;
            }
        }

        function nick_name(data) {
            htmlNickname = '';
            whisper = '';

            for (var i = 0; i < data.length; i++) {

                htmlNickname += "<li class='whoisonline'><i class='user icon' ></i> " + data[i] + "</li>";
                whisper += "<option value='" + data[i] + "'><i class='user icon' ></i>" + data[i] + "</option>";

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


            } else {
                name = name.val();

                name = storage.set('name', name);

                $('#empty-storage').show();

            }
            console.log('name: ' + name + ' avatar: ' + $avatar + ' storageCheck: ' + storageCheck);


            socket.emit('nickname', name);

            //======Listen for status========//
            socket.on('status', function (data) {

                if (typeof data !== 'object') {
                    //data will be a string in case of error status
                    statusbox.show().removeClass("alert-success");
                    statusbox.show().addClass("alert-danger");
                    setStatus(data);
                }
                if (data.clear === true) {

                    $('li.user').hide('slow');

                    textarea.val('');//clear textarea
                }

            });
            //

            var d = new Date();
            var n = d.toLocaleDateString();
            var t = d.toLocaleTimeString();

            var date = n + ' ' + t;

            socket.emit('userinput',
                {

                    name: name,
                    message: textarea.val(),
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



    } //end socket


});// End ready
