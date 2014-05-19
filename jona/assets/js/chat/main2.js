//TODO
// Notify in message List connects/disconnects
// Notify in message List own away status
// Markdown no maneja super bien los links
// Agregar Highlight.js http://highlightjs.org/ (?)



// IDLE init
ifvisible.setIdleDuration(5);

ifvisible.idle(function(){
    console.log("IDLE ...");
    setUserStatus("idle");
});

ifvisible.wakeup(function(){
    console.log("AWAKE !");
    setUserStatus("online");
});

// MArkdown init
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

/* ################### */
      var MESSAGES_URI  = 'https://blistering-fire-3276.firebaseio.com/messages';
      var USERS_URI     = 'https://blistering-fire-3276.firebaseio.com/users';
      var CONNECTED_URI = 'https://blistering-fire-3276.firebaseio.com/.info/connected';

      var inputElement = '#msgInput';
      var messagesElement = '.messages-wrapper';
      var usersListElement = '#usersWindow ul'

      var currentStatus = "online";

      var messagesRef = new Firebase(MESSAGES_URI);
      var usersRef    = new Firebase(USERS_URI);

      // Generate a reference to a new location for my user with push.
      var myUserRef = usersRef.push();

	$(document).ready(function(){
      // When the user presses enter on the message input, write the message to firebase.
      $(inputElement).keypress(function (e) {
        if (e.keyCode == 13) {
//          var name = $('#nameInput').val();
          var text = $(inputElement).val();
          var timestamp = Math.round(+new Date()/1000);
          // Push data TODO: Add timestamp ?
          messagesRef.push({name:name, text:text, ts:timestamp},  function(error) {
            if (error) {
              console.log('Send ERROR');
            } else {
              //console.log('Send OK');
            }
          });
          $(inputElement).val('');
        }
      });
     });
  
      // Add a callback that is triggered for each chat message.
      messagesRef.limit(10).on('child_added', function (snapshot) {
        var message = snapshot.val();
        var messageMarkdown = marked(message.text);
        var ts = timestampToDate(message.ts);
        var msgTpl = '<div class="talk-bubble tri-right left-top"><div class="talktext"><div>{CHANNEL}::<strong>{UserName}</strong>:</div>{Message}</div></div>';
        msgTpl = msgTpl.replace('{UserName}', message.name);        
        msgTpl = msgTpl.replace('{Message}', messageMarkdown);        
        $(msgTpl).appendTo($(messagesElement));
        $(messagesElement)[0].scrollTop = $(messagesElement)[0].scrollHeight;
      });

  // Get a reference to my own presence status.
  var connectedRef = new Firebase(CONNECTED_URI);
  connectedRef.on("value", function(isOnline) {
    if (isOnline.val()) {
      // If we lose our internet connection, we want ourselves removed from the list.
      myUserRef.onDisconnect().remove();

      // Set our initial online status.
      setUserStatus("online");
    } else {

      // We need to catch anytime we are marked as offline and then set the correct status. We
      // could be marked as offline 1) on page load or 2) when we lose our internet connection
      // temporarily.
      setUserStatus(currentStatus);
    }
  });

  // A helper function to let us set our own state.
  function setUserStatus(status) {
    // Set our status in the list of online users.
    currentStatus = status;
    myUserRef.set({ name: name, status: status });
  }

  // Update our GUI to show someone"s online status.
  usersRef.on("child_added", function(snapshot) {
    var user = snapshot.val();
    $(usersListElement).append($("<li/>").attr("id", snapshot.name()));

    if (user.status == "idle") {
      $("#" + snapshot.name()).html('<span class="entypo-moon"></span>' + user.name);
    } else {
      $("#" + snapshot.name()).html('<span class="entypo-eye"></span>' + user.name);
    }

    $(messagesElement).append('<div class="wentOffline">--- <span class="entypo-user-add"></span> '+user.name+' está online '+getTS()+'</div>');
    $(messagesElement)[0].scrollTop = $(messagesElement)[0].scrollHeight;
  });

  // Update our GUI to change a user"s status.
  usersRef.on("child_changed", function(snapshot) {
    var user = snapshot.val();
    if (user.status == "idle") {
      $("#" + snapshot.name()).html('<span class="entypo-moon"></span>' + user.name);
    } else {
      $("#" + snapshot.name()).html('<span class="entypo-eye"></span>' + user.name);
    }
  });

  // Update our GUI to remove the status of a user who has left.
  usersRef.on("child_removed", function(snapshot) {
    $("#" + snapshot.name()).remove();
    $(messagesElement).append('<div class="wentOffline">--- '+snapshot.val().name+' se desconectó '+getTS()+'</div>');
    $(messagesElement)[0].scrollTop = $(messagesElement)[0].scrollHeight;
  });

/* ################### */

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

