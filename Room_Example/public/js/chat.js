$(function () {
    $('.dropdown').dropdown();
    $('.ui.accordion').accordion();
    $('.menu .item').tab();

    let name,
        recognizeUser = $('.recognize-user'),
        textarea = $('.msg'),
        status = $('.chat-status span'),
        statusbox = $('.chat-status').hide(),
        statusOld = status.text(),
        $avatar = $('.text.Avatar'),
        userField = $('.user_name_field'),
        userNameInputField = $('#ChatName'),
        avatarGrid = $('#avatarGrid'),
        userGrid = $('#userGrid'),
        triggerUserAvatarDropDown = $('#triggerUserAvatarDropDown'),
        messagesDiv = $('.messages');

    messagesDiv.css({display: 'block'});

    let storage = Storages.localStorage;   /// session storage ///
    let storageCheck = (storage.isSet('_simonSayUserName_'));

    //===============//
    // BOT TEMPLATE //
    //=============//
    let welcomeBackTemplate = (name) => {
        return `
            <div class="ui feed animated bounceInDown">
                <div class="event">
                  <div class="label">
                    <i class="reddit alien icon"></i>
                  </div>
                  <div class="content">
                    <div class="summary">
                      <a>Friendly Bot</a>
                      <div class="date">
                        ${newDate()}
                      </div>
                    </div>
                    <div class="extra text">
                        <em>Welcome back - ${name}</em>
                    </div>
                    <div class="meta">
                      <a class="like"></a>
                    </div>
                  </div>
                 </div>
            </div>
          
            `;
    };
    let chooseUserNameTemplate = () => {
        return `
            <div class="ui feed animated bounceInDown">
                <div class="event">
                  <div class="label">
                    <i class="reddit alien icon"></i>
                  </div>
                  <div class="content">
                    <div class="summary">
                      <a>Friendly Bot</a>
                      <div class="date">
                        ${newDate()}
                      </div>
                    </div>
                    <div class="extra text">
                        <em>Hi, <br>
                            let's get started - choose a username first :)</em>
                    </div>
                    <div class="meta">
                      <a class="like"></a>
                    </div>
                  </div>
                 </div>
            </div>
           
        `;
    };
    const verifyRoom = () => {
        return `
             <div class="ui feed animated bounceInDown">
                <div class="event">
                  <div class="label">
                    <i class="reddit alien icon"></i>
                  </div>
                  <div class="content">
                    <div class="summary">
                      <a>Friendly Bot</a>
                      <div class="date">
                        ${newDate()}
                      </div>
                    </div>
                    <em class="extra text">
                        </em>Hi, nice to see you :) <br>
                        In order to verify this room, you have to start conversation first </em>
                    </div>
                    <div class="meta">
                      <a class="like"></a>
                    </div>
                  </div>
                 </div>
             </div>
        `;
    };


    //===============//
    // CHAT TEMPLATE //
    //=============//
    let chatTemplate = (avatar, name, date, message) => {
        return `
          <div class="ui feed animated bounceInDown">
            <div class="ui horizontal divider"><i class="comments outline icon"></i></div>
            <div class="event">
            <div class="label">
            ${avatar}
            </div>
            <div class="content">
            <div class="summary">
            <a>${name}</a>
            <div class="date">
            ${date}
            </div>
            </div>
            <div class="extra text">
                 | <i class='comment icon'></i> ${message}
            </div>
            <div class="meta">
            <a class="like"></a>
            </div>
            </div>
            </div>
           </div>      
      `;
    };

    ///////////////// SOCKET /////////////////////////////
    try {

        //// LOCALHOST SOCKET
        var socket = io.connect('http://localhost:3000/');  //// mit locales socket verbinden

        var pathArray = window.location.pathname.split('/');

    } catch (e) {
        console.log('Could not connect to socket.');
    }
    if (socket !== undefined) {

        //=======//
        // INIT //
        //=====//
        console.log('socket connected!');
        socket.emit('infoFirstTimeVisit', pathArray[1]);
        socket.on('infoFirstTimeVisit', function (data) {
            if (data.validRoom === false) {
                setTimeout(() => {
                    messagesDiv.prepend(verifyRoom());
                }, 1000);
            }
        });

        //==========//
        // TOOLTIP //
        //========//
        $('.li-avatar').popup({
            addTouchEvents: true,
            position: 'left center',
            title: 'choose your avatar, to express yourself!',
        })
        ;

        $('#emojify').popup({
            inline: true,
            addTouchEvents: true,
            position: 'top left',
            title: 'it\'s Emoji friendly!',
            content: 'So you can start conversation white a :smile:'
        })
        ;

        //============//
        //  *START*  //
        //==========//
        if (storage.isSet('_simonSayUserName_') && storage.get('_simonSayUserName_') !== '' && storage.get('_simonSayUserName_') !== 'null') {
            socket.emit('storage', true);
            setTimeout(() => {
                messagesDiv.prepend(welcomeBackTemplate(storage.get('_simonSayUserName_')));
            }, 1000);
        } else {
            socket.emit('storage', false);
            $('.recognize-user').html('');
            setTimeout(() => {
                messagesDiv.prepend(chooseUserNameTemplate());
            }, 1000);
            let keyUpChatName = $('input#ChatName'),
                keyUpTextarea = $('textarea#emojify');
            keyUpChatName.css('background', 'rgb(231, 218, 213)');
            keyUpTextarea.css('background', 'rgb(231, 218, 213)');
            keyUpChatName.keyup(function () {
                $(this).css('background', 'none');
                recognizeUser.removeClass(' animated flipInX');
                recognizeUser.addClass('animated bounceOutUp');
            });
            keyUpTextarea.keyup(function () {
                recognizeUser.removeClass(' animated flipInX');
                recognizeUser.addClass('animated bounceOutUp');
            });
        }

        //==================//
        //  ALL OUTPUTS    //
        //================//
        socket.on('output-all', function (data, storage_data) {
            storageData(storage_data);
            messagesDiv.prepend(chatTemplate(dataAv(data.avatar), dataN(data.name), data.date, dataM(data.message)));
        });

        //=======================//
        // OUTPUT AFTER SUBMIT  //
        //=====================//
        socket.on('output', function (data) {
            messagesDiv.prepend(chatTemplate(dataAv(data.avatar), dataN(data.name), data.date, dataM(data.message)));
        });

        //=======================//
        //    SUBMIT FORM       //
        //=====================//
        $('#submit').on('click', (e) => {
            e.preventDefault();
            let name;

            if (storageCheck === true) {
                name = storage.get('_simonSayUserName_');
            } else {
                name = userNameInputField.val();
                storage.set('_simonSayUserName_', userNameInputField.val());
            }

            //======Listen for status========//
            socket.on('status', function (data) {
                if (typeof data !== 'object') {
                    //data will be a string in case of error status
                    statusbox.show().removeClass("alert-success");
                    statusbox.show().addClass("alert-danger");
                    setStatus(data);
                }
                if (data.clear === true) {
                    userField.hide('slow');
                    textarea.val('');//clear textarea
                }
            });

            socket.emit('userinput',
                {
                    name: name,
                    message: emojyOutput(),
                    date: newDate(),
                    avatar: $avatar.html(),
                    url: pathArray[1]//sending room number scraping from url
                });
            $('#m').val(''); //clear input//
        });//end form

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

        function storageData(storage_data) {
            if (storage_data === true) {
                userField.hide();
            } else {
                userNameInputField.removeAttr('disabled');
            }
        }

        function emojyOutput() {
            return emojione.shortnameToImage(textarea.val());
        }

        function setStatus(s) {
            status.text(s);

            if (s !== statusOld) {
                let delay = setTimeout(function () {
                    setStatus(statusOld);
                    statusbox.hide();
                    clearInterval(delay);
                }, 3000);
            }
        };

        function newDate() {
            let d = new Date(),
                n = d.toLocaleDateString(),
                t = d.toLocaleTimeString();
            return n + ' ' + t;
        }

    } //end socket

    /////////////////SOCKET END/////////////////////////////

});// End jQuery ready
