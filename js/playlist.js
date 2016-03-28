var MusicPlayer = MusicPlayer || {};
var $ = require(__dirname+'/js/vendor/jquery-2.1.3.min.js');


$(function() {
  $(".mainView").on("drop", function(event) {
    event.preventDefault();
    var data = JSON.parse(event.originalEvent.dataTransfer.getData("voiceItemData"));

    if(data) {
      MusicPlayer.Playlist.add(data);
    }
  })
	.on("dragover", function(event) {
		event.preventDefault();
	});
});

MusicPlayer.Playlist = {
  data: []
};

MusicPlayer.Playlist.add = function(data)
{
	this.data.push(data);
	MusicPlayer.Playlist.updateElements();
};

MusicPlayer.Playlist.set = function(data)
{
	this.data = data;
	MusicPlayer.Playlist.updateElements();
};

MusicPlayer.Playlist.updateElements = function() {
	for(var i=0; i<this.data.length; i++) {

		var element = $(".playlist .item" + i);

		if(element.length === 0) {
			var cls = "";
			//if(MusicPlayer.Status.song && i < parseInt(MusicPlayer.Status.song)) {
      //  cls = "played";
      //}

			var before = $(".playlist .item" + (i - 1));
      var style = this.data[i].cover ? ' style=\'background-image: url("./covers/' + this.data[i].cover + '")\'' : "";

			element = $('<div class="cover new item' + i + ' ' + cls + '"><div class="pic"' + style + '></div></div>');
      element.data("song", this.data[i]);

			if(before.length === 0) {
				$(".playlist").prepend(element);
			} else {
				before.before(element);
			}
		}

		element.attr({
			"id": "song" + i,
			"data-index": i
		});
	}

	$(".playlist .cover").each(function() {
		var index = $(this).attr("data-index");
		if(index >= MusicPlayer.Playlist.data.length) {
			$(this).on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() { $(this).remove(); })
				   .attr("class", "cover remove").removeAttr("id").removeAttr("data-index").removeAttr("data-id");
		}
	});

	var nextIntervalAt = this.data.length / 4;
	var intervalDelay = 20;

	function addNewCover() {
		var element = $(".playlist .cover.new.current:last, .playlist .cover.new:last");

		if(element.length === 0) {
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
};
