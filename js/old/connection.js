var MusicPlayer = MusicPlayer || {};

MusicPlayer.Connection = {};

MusicPlayer.Connection.createMessage = function(message, params) {
	return {
		message: message,
		params: params
	};
}

///when we receive a message from the server
MusicPlayer.Connection.onmessage = function(data)
{
	var msg = JSON.parse(data.data);
	if(msg.message) {
		if(MusicPlayer.Commands[msg.message]) {
			MusicPlayer.Commands[msg.message].apply(window, [msg.param]);
		}
	}
}

///Start the connection
MusicPlayer.Connection.start = function(callback)
{
	MusicPlayer.Connection.conn = new WebSocket('ws://127.0.0.1:8080');

	MusicPlayer.Connection.conn.onopen = function(e) {
	    callback.call();
	};

	MusicPlayer.Connection.conn.onmessage = MusicPlayer.Connection.onmessage;
}

///Send message
MusicPlayer.Connection.send = function(data)
{
	if(MusicPlayer.Connection.conn.readyState == 1) {
		MusicPlayer.Connection.conn.send(data);
	}
}

MusicPlayer.Connection.sendText = function(data) {
	MusicPlayer.Connection.send(JSON.stringify(MusicPlayer.Connection.createMessage(data)));
}

MusicPlayer.Connection.sendObject = function(data) {
	var message = arguments[0];
	var params = [];

	for(var i =1; i<arguments.length; i++)
		params.push(arguments[i]);

	MusicPlayer.Connection.send(JSON.stringify(MusicPlayer.Connection.createMessage(message, params)));
}

///Get song cover
MusicPlayer.Connection.getcover = function(artist, title, album, file)
{
	var data = MusicPlayer.Connection.createMessage("getcover", {
		artist: artist,
		title: title,
		album: album,
		file: file
	});

	MusicPlayer.Connection.send(JSON.stringify(data));
}

//Get status
MusicPlayer.Connection.status = function()
{
	MusicPlayer.Connection.sendText("status");
}

//Get status
MusicPlayer.Connection.play = function(songpos)
{
	if(songpos >= 0) {
		MusicPlayer.Connection.sendObject("play", songpos);
	} else MusicPlayer.Connection.sendText("play");
}

//Get status
MusicPlayer.Connection.pause = function()
{
	MusicPlayer.Connection.sendText("pause");
}

//Get status
MusicPlayer.Connection.stop = function()
{
	MusicPlayer.Connection.sendText("stop");
}

//seek the current song
MusicPlayer.Connection.seekcur = function(positionInSeconds)
{
	var positionInSeconds = Math.round(positionInSeconds * 100) / 100
	MusicPlayer.Connection.sendObject("seekcur", parseInt(positionInSeconds));
}

//Load the current playlist
MusicPlayer.Connection.playlistinfo = function()
{
	MusicPlayer.Connection.sendText("playlistinfo");
}


//set random mode
MusicPlayer.Connection.random = function(val)
{
	MusicPlayer.Connection.sendObject("random", (val ? "1" : "0") );
}

//set repeat mode
MusicPlayer.Connection.repeat = function(val)
{
	MusicPlayer.Connection.sendObject("repeat", (val ? "1" : "0") );
	MusicPlayer.Connection.sendText("status");
}

$(function() {
	MusicPlayer.Connection.start(function() {
		MusicPlayer.Connection.status();

		setTimeout(function() {
			MusicPlayer.Connection.playlistinfo();
		}, 1000);
	});
});