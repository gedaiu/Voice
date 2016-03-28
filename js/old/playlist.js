var MusicPlayer = MusicPlayer || {};

MusicPlayer.Playlist = {};

MusicPlayer.Playlist.set = function(data)
{
	clearInterval( MusicPlayer.Playlist.newTimeinterval );
	MusicPlayer.Playlist.data = data;

	for(var i=0; i<data.length; i++) {
		MusicPlayer.Connection.getcover(data[i].Artist, data[i].Title, data[i].Album, data[i].file);

		if(MusicPlayer.Playlist.data.length <= i - 1 || MusicPlayer.Playlist.data[i].file != data[i].file) {
			MusicPlayer.Playlist.data[i] = data[i];
		}

		if(MusicPlayer.Playlist.data[i].file != data[i].file) {
			var elm = $(".playlist .item"+data[i].Pos);
			elm.attr("class", "cover remove").removeAttr("id").removeAttr("data-index").removeAttr("data-id");
		}

		var element = $(".playlist .item"+data[i].Pos);

		if(element.length == 0) {
			var cls = "";
			if(MusicPlayer.Status.song && i < parseInt(MusicPlayer.Status.song)) cls = "played";

			var before = $(".playlist .item"+(data[i].Pos - 1));
			element = $('<div class="cover new item'+data[i].Pos+' '+cls+'"><div class="pic"></div></div>');

			if(before.length == 0) {
				$(".playlist").prepend(element);
			} else {
				before.before(element);
			}
		}

		element.attr({
			"id": "song" + data[i].Id,
			"data-id": data[i].Id,
			"data-index": data[i].Pos
		});
	}

	$(".playlist .cover").each(function() {
		var index = $(this).attr("data-index");
		if(index >= MusicPlayer.Playlist.data.length) {
			$(this).on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() { $(this).remove(); })
				   .attr("class", "cover remove").removeAttr("id").removeAttr("data-index").removeAttr("data-id");
		}
	});

	var nextIntervalAt = data.length / 4;
	var intervalDelay = 20;

	function addNewCover() {
		var element = $(".playlist .cover.new.current:last, .playlist .cover.new:last");

		if(element.length == 0) {
			clearInterval( MusicPlayer.Playlist.newTimeinterval );
			return;
		}
		else {
			$(element[0]).removeClass("new");
		}

		if( $(".playlist .cover.new").length <= nextIntervalAt) {
			clearInterval( MusicPlayer.Playlist.newTimeinterval );

			intervalDelay += parseInt(intervalDelay/8);
			nextIntervalAt -= parseInt(nextIntervalAt / 4);

			MusicPlayer.Playlist.newTimeinterval = setInterval(addNewCover, intervalDelay);
		}
	}

	MusicPlayer.Graphics.Refresh();
	MusicPlayer.Playlist.newTimeinterval = setInterval(addNewCover, intervalDelay);
}

MusicPlayer.Playlist.setcover = function(file, cover)
{
	for(var i=0; i<MusicPlayer.Playlist.data.length; i++) {
		if(MusicPlayer.Playlist.data[i].file == file) {
			MusicPlayer.Playlist.data[i].cover = cover;
		}
	}

	MusicPlayer.Graphics.Refresh();
}
