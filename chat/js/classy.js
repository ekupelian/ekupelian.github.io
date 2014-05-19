/*

	×º°”˜`”°º× [ GuacaChat ] ×º°”˜`”°º×

*/

var GuakaConf = {
	DebugMode: true,
	IdleDuration: 5,

	//# FireBase channels
	FIREBASE: 'https://blistering-fire-3276.firebaseio.com/',
	FB_MESSAGES : 'messages',
	FB_USERS    : 'users',
	FB_CONNECTED: '.info/connected',

	//# Layout Conf
	inputElement    : '#msgInput',
	messagesElement : '.messages-wrapper',
	usersListElement: '#usersWindow ul'
};

/*
var GuakaChat = (function() {
	var variableTest;

	function Init() {
		console.debug('GuakaChat::Init');	
	}
	
})();
*/
var GuakaChat = {
	currentUser:"",
	Init:function () {
		console.debug('GuakaChat::Init');	
	},
	Init2:function () {
		this.Init();
	},
};

console.debug('GuakaChat::MainClass');
GuakaChat.Init2();
//GuakaChat.Init();

/*
// CLASES AUXILIARES

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

*/

/*

function Guakala {

	function INIT(Conf) {
		// IfVisible Init (Handles Idleness)
		ifvisible.setIdleDuration(Conf.IdleDuration);

		// Marked init (MarkDown)
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

	}



}

// Capture console.log to depend on DEBUG Flag
(function(){                               // Closure so no other functions have direct access to oldLog
    var oldLog = console.log;
	console.log('
	 ██████╗ ██╗   ██╗ █████╗  ██████╗ █████╗  ██████╗██╗  ██╗ █████╗ ████████╗
	██╔════╝ ██║   ██║██╔══██╗██╔════╝██╔══██╗██╔════╝██║  ██║██╔══██╗╚══██╔══╝
	██║  ███╗██║   ██║███████║██║     ███████║██║     ███████║███████║   ██║   
	██║   ██║██║   ██║██╔══██║██║     ██╔══██║██║     ██╔══██║██╔══██║   ██║   
	╚██████╔╝╚██████╔╝██║  ██║╚██████╗██║  ██║╚██████╗██║  ██║██║  ██║   ██║   
	 ╚═════╝  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
	');

    console.log = function (message) {
        // DO MESSAGE HERE.
        oldLog.apply(console, arguments);
    };
})();



*/