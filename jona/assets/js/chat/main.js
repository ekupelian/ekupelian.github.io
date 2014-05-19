//TODO
// Notify in message List connects/disconnects
// Notify in message List own away status



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

      var currentStatus = "online";

      var messagesRef = new Firebase(MESSAGES_URI);
      var usersRef    = new Firebase(USERS_URI);

      // Generate a reference to a new location for my user with push.
      var myUserRef = usersRef.push();

	$(document).ready(function(){
      // When the user presses enter on the message input, write the message to firebase.
      $('#messageInput').keypress(function (e) {
        if (e.keyCode == 13) {
//          var name = $('#nameInput').val();
          var text = $('#messageInput').val();
          var timestamp = Math.round(+new Date()/1000);
          // Push data TODO: Add timestamp ?
          messagesRef.push({name:name, text:text, ts:timestamp},  function(error) {
            if (error) {
              console.log('Send ERROR');
            } else {
              //console.log('Send OK');
            }
          });
          $('#messageInput').val('');
        }
      });
     });
      // Add a callback that is triggered for each chat message.
      messagesRef.limit(10).on('child_added', function (snapshot) {
        var message = snapshot.val();
        // Convert text2links
        //var msg = convertToLinks(message.text);
        // Markdown FTW (?)
        var msg = marked(message.text);
        var ts = timestampToDate(message.ts);
        /*
        TODO: 
          Markdown no maneja super bien los links
          Agregar Highlight.js http://highlightjs.org/ (?)
        */
        $('<div/>').html(msg).prepend($('<em/>')
          .text(ts + message.name+': ')).appendTo($('#messagesList'));
        $('#messagesList')[0].scrollTop = $('#messagesList')[0].scrollHeight;
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
    $("#userList").append($("<div/>").attr("id", snapshot.name()));

    if (user.status == "idle") {
        $("#" + snapshot.name()).addClass('userAway');
    }
    $("#" + snapshot.name()).text('#' + user.name);
  });

  // Update our GUI to remove the status of a user who has left.
  usersRef.on("child_removed", function(snapshot) {
    $("#" + snapshot.name()).remove();
  });

  // Update our GUI to change a user"s status.
  usersRef.on("child_changed", function(snapshot) {
    var user = snapshot.val();
    $("#" + snapshot.name()).text('#' + user.name).toggleClass('userAway');
  });

/* ################### */

/* http://www.jontetzlaff.com/blog/2012/08/23/converting-string-urls-to-clickable-links-with-javascript/ */
function convertToLinks(text) {
  var replaceText, replacePattern1;

  //URLs starting with http://, https://
  replacePattern1 = /(\b(https?):\/\/[-A-Z0-9+&amp;@#\/%?=~_|!:,.;]*[-A-Z0-9+&amp;@#\/%=~_|])/ig;
  replacedText = text.replace(replacePattern1, '<a class="colored-link-1" title="$1" href="$1" target="_blank">$1</a>');

  //URLs starting with "www."
  replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  replacedText = replacedText.replace(replacePattern2, '$1<a class="colored-link-1" href="http://$2" target="_blank">$2</a>');

  //TODO: catch subdomains

  //returns the text result
  return replacedText;
}

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
    var dateTime = '['+year+'/'+month+'/'+day+' '+hour+':'+minute+'] ';
    return dateTime;
}

