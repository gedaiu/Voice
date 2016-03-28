var MusicPlayer = MusicPlayer || {};

MusicPlayer.Graphics = {};
MusicPlayer.Graphics.GenerateStyles = function()
{
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

		var index = $(this).attr("data-index");

		if(MusicPlayer.Playlist.data[index] && 'cover' in MusicPlayer.Playlist.data[index]) {
			var prop = "url('covers/" + MusicPlayer.Playlist.data[index].cover + "')";
			$(this).find(".pic").css("background-image", prop);
		}
	});

	if('Status' in MusicPlayer && 'songid' in MusicPlayer.Status && 'Playlist' in MusicPlayer && 'data' in MusicPlayer.Playlist) {
		var songid = MusicPlayer.Status.songid;
		var current = $(".playlist .cover.current");
		var next = $("#song" + songid);

		if(next.length > 0 && ( current.length === 0 || current.attr("data-id") !== songid )) {
			var w = $(window).width() / 2;
			var index = next.attr("data-index");

			var sec = MusicPlayer.Playlist.data[index].Time;
			var min = parseInt(sec/60);

			$(".playing .artist").html(MusicPlayer.Playlist.data[index].Artist);
			$(".playing .title").html(MusicPlayer.Playlist.data[index].Title);
			$(".time .total").html(formatTime(min, sec - min*60));

			var endCoverTransition = function(event) {
				$(".playing .song").html(next.clone());
				$(".playing .cover").removeAttr("style").removeAttr("id").removeClass("rotated").attr("class", "cover");

				next.removeClass("front played").addClass("hide");

				$(this).off( 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', endCoverTransition);

				return false;
			}

			next.addClass("current").on( 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', endCoverTransition);

			current.removeClass("hide");

			setTimeout(function() {
				current.removeClass("current");

				if( parseInt(next.attr("data-index")) > parseInt(current.attr("data-index")) ) {
					for(var i = parseInt(current.attr("data-index")); i < parseInt(next.attr("data-index")); i++ ) {
						$(".playlist .item"+i).addClass("played");
					}
				} else {
					for(var i = parseInt(next.attr("data-index")) + 1; i < MusicPlayer.Playlist.data.length; i++ ) {
						if($(".playlist .item"+i).is(".played")) $(".playlist .item"+i).addClass("front").removeClass("played");
					}

					setTimeout(function() {
						$(".playlist .cover.front").removeClass("front");
					}, 500);
				}
			});

			$(".playing .song").html("");
		}
	}

	if(MusicPlayer.Status && MusicPlayer.Status.state) {
		$(".controls").attr("class", "controls " + MusicPlayer.Status.state);
	}

};

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

	$(window).resize(function() {
		MusicPlayer.Graphics.Refresh();
	}).resize();

	$(".controls .pause").click(function() {
		MusicPlayer.Connection.pause();
	});

	$(".controls .play").click(function() {
		MusicPlayer.Connection.play();
	});

	$(".controls .stop").click(function() {
		MusicPlayer.Connection.stop();
	});

	$(".playMode .random").click(function() {
		MusicPlayer.Connection.random( !$("body").is(".random") );
	});

	$(".playMode .repeat").click(function() {
		MusicPlayer.Connection.repeat( !$("body").is(".repeat") );
	});

	$(".playlist").on("click", ".cover", function() {

		if( $(".playlist .cover.current").length <= 1 ) {
			MusicPlayer.Connection.play( $(this).attr("data-index") );
		}

		return false;
	});

	$(".time .line").click(function(event) {
		if(MusicPlayer.Status && ( MusicPlayer.Status.elapsed || MusicPlayer.Status.elapsed === 0) ) {
			var o = $(this).offset();
			var pos = event.clientX - o.left;
			var w = $(this).width();

			if(pos < 0) pos = 0;
			if(pos > w) pos = w;

			var percentage = pos/w;

			var index = $(".playlist .cover.current").attr("data-index");

			MusicPlayer.Connection.seekcur( percentage * MusicPlayer.Playlist.data[index].Time );
		}
	});

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

	}, 1000);
});
