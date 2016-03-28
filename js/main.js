var MusicPlayer = MusicPlayer || {};
var $ = require(__dirname+'/js/vendor/jquery-2.1.3.min.js');

MusicPlayer.Graphics = {};
MusicPlayer.Graphics.GenerateStyles = function()
{
	$("#coverStyles").remove();

	if(MusicPlayer.Playlist && MusicPlayer.Playlist.data && $("#coverStyles").length === 0) {
		var style = '<style id="coverStyles">';

		var deg = 0;
		var degStep = 360 / MusicPlayer.Playlist.data.length;
		var totalItems = MusicPlayer.Playlist.data.length;

		degStep = Math.round(degStep * 100) / 100;

		for(var i = 0; i<totalItems; i++) {
			var deg2 = deg % 360;
			if(deg2 > 180) deg2 -= 360;

			var rad = ((deg + 90) % 360) * (Math.PI / 180);
			var x = 300 * Math.cos (rad);
        	var y = 300 * Math.sin (rad);

        	x = Math.round(x * 100) / 100;
        	y = Math.round(y * 100) / 100;

        	var randDeg = Math.random() * 360;
        	var sign = " + ";
        	if(Math.random() > 0.5) sign = " - ";

        	var randX = sign + "200px" + sign + parseInt(Math.random() * 35) + "%";
        	var randY = parseInt(Math.random() * 40);

			style +=
'	.playlist .cover.item' + i + '{' +
'		left: calc( 75% - 100px );' +
'		transform: rotate(' + deg2 + 'deg);' +
'		-webkit-transform: rotate(' + deg2 + 'deg);' +
'	}' +

'	.playlist .cover.played.item' + i + ',.playlist .cover.front.item' + i + '{' +
'		z-index: ' + i + ';' +
'	}' +

'	body.repeat .cover.item' + i + '{' +
'		left: calc( 50% - 100px - ' + x + 'px);' +
'		top: calc( 50% - 75px - ' + y + 'px);' +
'		transform: rotate(' + deg2 + 'deg)  scale(0.6);' +
'		-webkit-transform: rotate(' + deg2 + 'deg)  scale(0.6);' +
'		z-index: 1000;' +
'	}'+

'	body.random .cover.item' + i + '{' +
'		left: calc( 50% - 100px ' + randX+');' +
'		top: calc( 50% - 200px + ' + randY+'%);' +
'		transform: rotate(' + randDeg + 'deg)  scale(0.6);' +
'		-webkit-transform: rotate(' + randDeg + 'deg)  scale(0.6);' +
'		z-index: ' + i + ';' +
'	}';

			deg += degStep;
		}

		style += '</style>';
		$("body").append(style);
	}

};

MusicPlayer.Graphics.Refresh = function()
{
	MusicPlayer.Graphics.GenerateStyles();

	var w = $(window).width();
	var h = $(window).height();

	var top = ( h - 200 ) / 2;

	$("#mainCover").css({
		top:  top,
		left: ( w/2 - 200 ) / 2
	});

	var list = $($(".playlist .cover").get().reverse());

	list.each(function() {
		$(this).removeClass("new");
	});
};

function niceTime(seconds) {
	seconds = parseInt(seconds);
	minutes = parseInt(parseInt(seconds) / 60);

	return formatTime(minutes, seconds - minutes * 60);
}

function formatTime(m, s) {
	var result;

	if(m <= 9) {
		m = "0" + (m+"");
	}

	if(s <= 9) {
		s = "0" + (s+"");
	}

	return m + ":" + s;
}

$(function() {

	MusicPlayer.Player.onTime = function(time, duration) {
		$(".time .elapsed").html(niceTime(time));
		$(".time .total").html(niceTime(duration));

		var percentage = parseFloat( (time/duration) * 100 );

		$(".time .line .position").css({
			left: "calc(" + percentage + "% - 2px)"
		});
	};

	$(window).resize(function() {
		MusicPlayer.Graphics.Refresh();
	}).resize();

	$(".controls .pause").click(function() {
		$(".playing .controls").removeClass("stop play").addClass("pause");
		MusicPlayer.Player.pause();
	});

	$(".controls .play").click(function() {
		$(".playing .controls").removeClass("stop pause").addClass("play");
		MusicPlayer.Player.play();
	});

	$(".controls .stop").click(function() {
		$(".playing .controls").removeClass("play pause").addClass("stop");

		MusicPlayer.Player.stop();
	});

	$(".playMode .random").click(function() {
		$("body").removeClass("repeat").toggleClass("random");
	});

	$(".playMode .repeat").click(function() {
		$("body").removeClass("random").toggleClass("repeat");
	});

	$(".playlist").on("click", ".cover", function() {
		var data = $(this).data("song");

		$(".cover.current").removeClass("current").addClass("played");
		$(".playing .controls").removeClass("stop pause").addClass("play");

		$(this).addClass("current");

		MusicPlayer.Player.play(data);

		return false;
	});

	$(".time .line").click(function(event) {
		var o = $(this).offset();
		var pos = event.clientX - o.left;
		var w = $(this).width();

		if(pos < 0) pos = 0;
		if(pos > w) pos = w;

		MusicPlayer.Player.seek( pos/w );
	});

/*
	setInterval(function() {

		if('Playlist' in MusicPlayer && 'data' in MusicPlayer.Playlist && 'Status' in MusicPlayer && 'elapsed' in MusicPlayer.Status ) {
			if(MusicPlayer.Status.state == "play") MusicPlayer.Status.elapsed += 1;

			var index = $(".playlist .cover.current").attr("data-index");

			if(MusicPlayer.Playlist.data[index].Time < MusicPlayer.Status.elapsed) {
				MusicPlayer.Connection.send("noidle");
				MusicPlayer.Connection.status();
			} else {
				var sec = parseInt(MusicPlayer.Status.elapsed);
				var min = parseInt(sec/60);

				$(".time .elapsed").html(formatTime(min, sec - min*60));
			}

			//update the timeline
			var total = MusicPlayer.Playlist.data[index].Time;
			var pos = parseFloat(MusicPlayer.Status.elapsed);
			var percentage = parseFloat( (pos/total) * 100 );

			$(".time .line .position").css({
				left: "calc(" + percentage + "% - 2px)"
			});
		}

	}, 1000);*/
});
