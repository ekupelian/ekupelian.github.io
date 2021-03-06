/*
    ×º°”˜`”°º× [ GuacaChat ] ×º°”˜`”°º×
    main.js

*/

var GuacaConf = {
    DEBUG: true,
    IdleDuration: 5,

    //# FireBase channels
    FIREBASE: 'https://blistering-fire-3276.firebaseio.com/',
    FB_MESSAGES : 'messages',
    FB_USERS    : 'users',
    FB_CONNECTED: '.info/connected',

    //# Layout Conf
    chatScreen      : '#chatwindow',
    inputElement    : '#msgInput',
    messagesElement : '.messages-wrapper',
    usersListElement: '#usersWindow ul',
    login_errors    : '#login_error_msgs'
};

var GuacaChat = {
    firebaseRef : "",
    usersRef : "",
    authRef : "",
    messagesRef : "",
    userChatName : "",

    Init:function () {
        console.log(' ██████╗ ██╗   ██╗ █████╗  ██████╗ █████╗  ██████╗██╗  ██╗ █████╗ ████████╗\n██╔════╝ ██║   ██║██╔══██╗██╔════╝██╔══██╗██╔════╝██║  ██║██╔══██╗╚══██╔══╝\n██║  ███╗██║   ██║███████║██║     ███████║██║     ███████║███████║   ██║   \n██║   ██║██║   ██║██╔══██║██║     ██╔══██║██║     ██╔══██║██╔══██║   ██║   \n╚██████╔╝╚██████╔╝██║  ██║╚██████╗██║  ██║╚██████╗██║  ██║██║  ██║   ██║   \n ╚═════╝  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   \n');
        console.log('Versión: 0.0.1');

        console.debug('[ACTION]::Init');

        // IDLE init & event mapping
        ifvisible.setIdleDuration(GuacaConf.IdleDuration);

        ifvisible.idle(function(){
            console.debug("EVENT::[IDLE]");
            // setUserStatus("idle");
        });

        ifvisible.wakeup(function(){
            console.debug("EVENT::[AWAKE]");
            // setUserStatus("online");
        });
        
        // Markdown initial options
        marked.setOptions({
            renderer: new marked.Renderer(),
            gfm: true,
            tables: false,
            breaks: false,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: true
        });
    },

    _loggedIn: function (user) {
        console.debug("[ACTION]::_loggedIn");

        // Create Users Channel
        this.usersRef = new Firebase(GuacaConf.FIREBASE+GuacaConf.FB_USERS);
        // Generate a reference to a new location for my user with push.
        var myUserRef = this.usersRef.push();
        // Mark ourselves as online
        user.status = 'online';
        user.chatName = user.email.split('@')[0];
        this.userChatName = user.chatName;
        myUserRef.set(user);
        // Remove from channel if we disconnect
        myUserRef.onDisconnect().remove();

        $(GuacaConf.chatScreen).show();

        // Create Public msgs Channel
        this.messagesRef = new Firebase(GuacaConf.FIREBASE+GuacaConf.FB_MESSAGES);

        // Handle chat input
        $(GuacaConf.inputElement).keypress(this.userChatName,this._handleInput);
        // Handle messages stream
        this.messagesRef.limit(10).on('child_added', this._handleMessages);
    },

    _handleInput: function (e) {
        if (e.keyCode == 13) {
            console.debug("[ACTION]::_handleInput");
            var text = $(GuacaConf.inputElement).val().trim();
            if (!text) {return}
            var timestamp = Math.round(+new Date()/1000);
            GuacaChat.messagesRef.push({name: e.data, text: text, ts: timestamp, origin: "user"},  function(error) {
                if (error) {
                    console.debug('Send ERROR');
                    //TODO: update message stream
                } else {
                    console.debug('Sent ['+text+']');
                }
            });

            $(GuacaConf.inputElement).val('');
        }
    },

    _handleMessages: function (snapshot) {
        console.debug("[ACTION]::_handleInput");
        var stream = snapshot.val();
        var messageMarkdown = marked(stream.text);
        var ts = timestampToDate(stream.ts);
        var msgTpl = '<div class="talk-bubble tri-right left-top"><div class="talktext"><div>{CHANNEL}::<strong>{UserName}</strong>:</div>{Message}</div></div>';
        msgTpl = msgTpl.replace('{UserName}', stream.name);
        msgTpl = msgTpl.replace('{Message}', messageMarkdown);
        $(msgTpl).appendTo($(GuacaConf.messagesElement));
        $(GuacaConf.messagesElement)[0].scrollTop = $(GuacaConf.messagesElement)[0].scrollHeight;
    },

    _handleAuth: function (error, user) {
        console.debug("[ACTION]::_handleAuth");
        if (error) {
            // an error occurred while attempting login
            console.debug('['+error.code+']: '+error.message);
            $(GuacaConf.login_errors).html('An error occured while trying to login. ['+error.code+']');
            $('#errorwindow').show();
        } else if (user) {
            // user authenticated with Firebase
            console.debug('VAR::user');
            console.debug(user);

            // Belongs to Lyracons ?
            var domain = user.email.split('@')[1];
            if (domain === 'lyracons.com') {
                console.debug('[ACCESS GRANTED]');
                console.debug('_handleAuth:this'+this);
                //GuacaChat._loggedIn(user);
                _loggedIn(user).call(GuacaChat);

            } else {
                console.debug('[ACCESS DENIED]: Not a member of Lyracons');
                $(GuacaConf.login_errors).html('ACCESS DENIED. Only Lyracons staff is allowed');
                $('#errorwindow').show();
            }
        } else {
            // user is not logged
            console.debug('NOT LOGGED IN');
        }
    },

    Login:function () {
        console.debug("[ACTION]::Login");

        this.firebaseRef = new Firebase('https://blistering-fire-3276.firebaseio.com');
        console.debug('Login:this'+this);
        this.authRef = new FirebaseSimpleLogin(this.firebaseRef, this._handleAuth); // Closure  ?

        this.authRef.login('google', {
            //rememberMe: true, // Override default session length (browser session) to be 30 days
            scope: 'https://www.googleapis.com/auth/plus.profile.emails.read' // A comma-delimited list of requested extended permissions. See https://developers.google.com/+/api/oauth
        });
    },

    Logout:function () {
        console.debug("[ACTION]::Logout");
        this.authRef.logout();
    },

};


// Aux functions
function timestampToDate(unix_ts) {
    var date    = new Date(unix_ts * 1000);
    var year    = date.getFullYear();
    var month   = date.getMonth()+1; 
    var day     = date.getDate();
    var hour    = date.getHours();
    var minute  = date.getMinutes();
//    var second  = date.getSeconds();
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    var dateTime = '['+year+'/'+month+'/'+day+' '+hour+':'+minute+'] ';
    return dateTime;
}

function getTS() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
//    var second  = now.getSeconds();
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    var dateTime = '['+year+'/'+month+'/'+day+' '+hour+':'+minute+']';
    return dateTime;
}

// Hijack console.debug
if(!GuacaConf.DEBUG){
    if(!window.console) window.console = {};
    var methods = ["debug"]; // ["log", "debug", "warn", "info"];
    for(var i=0;i<methods.length;i++){
        console[methods[i]] = function(){};
    }
}
