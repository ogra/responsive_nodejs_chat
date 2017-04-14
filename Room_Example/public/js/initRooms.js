$(function () {
    
    let storage = Storages.localStorage;
    
    try {
        ///LOCALHOST
        var socket = io.connect('http://localhost:3000/');  //// mit locales socket verbinden

    } catch (e) {
        console.log('Could not connect to socket.');
    }

    if (socket !== undefined) {
        console.log('Socket connection Ok!');

        /// remove storage ///
        storage.remove('_simonSaysChatRoom_');
        storage.remove('_simonSayUserName_');

        /// room validation ///
        pureReact('#code', null, function (m) {
            let room = m.target.value,
                goToRoom = $('#goToRoom'),
                lockerIcon = $('#lockerIcon');
            // console.log(room);
            socket.emit("roomValidation", room);
            socket.on("foundValideRoom", function (data) {

                if (data.validRoom) {
                    lockerIcon.removeClass('fa-lock').css('color', 'red');
                    lockerIcon.addClass('fa-unlock').css('color', 'green');

                    storage.set('_simonSaysChatRoom_',data.roomCode);

                    goToRoom.removeClass('grey');
                    goToRoom.addClass('blue');
                    goToRoom.attr('href', '/' + data.roomCode);
                    goToRoom.html('<i class="fa fa-smile-o"></i> Join in!');

                } else {
                    lockerIcon.removeClass('fa-unlock').css('color', 'green');
                    lockerIcon.addClass('fa-lock').css('color', 'red');
                    goToRoom.removeClass('green');
                    goToRoom.addClass('grey');

                    storage.remove('_simonSaysChatRoom_');


                    goToRoom.html('<i class="fa fa-frown-o"></i> Never heard of it!');
                }

            });

        });

    }// End socket

    $('.ui.accordion')
        .accordion({
            onOpen:()=>{
                $('#code').val('');
                createRoomAndVisitBox.hide();
                storage.remove('_simonSaysChatRoom_');
                storage.remove('_simonSayUserName_');
            }
        })
    ;

    let createRoom = $('#createRoom'),
        createRoomAndVisitBox = $('#createRoomAndVisitBox'),
        verifyCodeUrl = $('#verifyCodeUrl'),
        //toBeVeryfied = $('#toBeVerified'),
        newRandomCode = $('input#newRandomCode'),
        goToRoom = ('#goToRoom'),
        rule1 = $('.rule1'),
        rule2 = $('.rule2'),
        rule3 = $('.rule3'),
        rule4 = $('.rule4'),
        alert1 = $('.alert1'),
        copyCode = $('#copyCode'),
        newRandomUrl = $('#newRandomUrl');


    //================//
    // Tooltip info  //
    //==============//
    const clipboard = new Clipboard('.btn');

    copyCode.popup({
        popup: $('.custom.popup'),
        on: 'click'
    });

    createRoom.on('click', function (e) {
        e.preventDefault();
        createRoomAndVisitBox.show();
        let random = randCode(20);

        //toBeVeryfied.text(random);
        newRandomCode.val(random);

        storage.set('_simonSaysChatRoom_', random);

        verifyCodeUrl.attr('disabled', false);

        rule1.css('color', 'grey');
        rule2.css('color', 'white');
        rule3.css('color', 'white');
        rule4.css('color', 'white');

        newRandomCode.css('color', 'red');

        alert1.css('display', 'block').addClass('');

        // $(this).removeClass('green').addClass('white');
        verifyCodeUrl.addClass('green');
        newRandomUrl.addClass('blue').css('color', 'white').attr('href', '/' + random);


    });


    let randCode = function (length) {
        let code = "";
        let rand = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < length; i++) code += rand.charAt(Math.floor(Math.random() * rand.length));
        return code;
    };

});
