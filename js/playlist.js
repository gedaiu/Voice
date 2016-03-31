var MusicPlayer = MusicPlayer || {};
var $ = require(__dirname+'/js/vendor/jquery-2.1.3.min.js');

$(function() {
  $(".mainView").on("drop", function(event) {
    event.preventDefault();
    var data = JSON.parse(event.originalEvent.dataTransfer.getData("voiceItemData"));

    console.log(data);

    if(typeof data === "string") {
      MusicPlayer.Playlist.add(data);
    }

    if(typeof data === "object") {
      data.forEach(function(item) {
        MusicPlayer.Playlist.add(item);
      });
    }

    MusicPlayer.Playlist.updateElements();
  })
	.on("dragover", function(event) {
		event.preventDefault();
	});
});

MusicPlayer.Playlist = {
  data: []
};

MusicPlayer.Playlist.add = function(id)
{
  var added = false;

  if(this.data && this.data.forEach) {
    this.data.forEach((item, i) => {
      if(id === item) {
        added = true;
        this.data[i] = id;
      }
    });
  }

  if(!added) {
    this.data.push(id);
  }

	MusicPlayer.Playlist.updateElements();
};

MusicPlayer.Playlist.set = function(data)
{
	this.data = data;
	MusicPlayer.Playlist.updateElements();
};

MusicPlayer.Playlist.set = function(data)
{
	this.data = data;
	MusicPlayer.Playlist.updateElements();
};

MusicPlayer.Playlist.updateElements = function() {
	for(var i=0; i<this.data.length; i++) {
    var item = MusicPlayer.Collection.data[this.data[i]];

    console.log(i, this.data[i], item);

		var element = $(".mainView .playlist .item" + i);

		if(element.length === 0) {
			var before = $(".mainView .playlist .item" + (i - 1));
      var style = item.cover ? ' style=\'background-image: url("' + item.cover + '")\'' : "";

			element = $('<div class="cover new item' + i + '"><div class="pic"' + style + '></div></div>');
      element.data("song", item);

			if(before.length === 0) {
				$(".mainView .playlist").prepend(element);
			} else {
				before.before(element);
			}
		}

		element.attr({
			"id": "song" + i,
			"data-index": i
		});
	}

	$(".mainView .playlist .cover").each(function() {
		var index = $(this).attr("data-index");
		if(index >= MusicPlayer.Playlist.data.length) {
			$(this).on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() { $(this).remove(); })
				   .attr("class", "cover remove").removeAttr("id").removeAttr("data-index").removeAttr("data-id");
		}
	});

	MusicPlayer.Graphics.Refresh();
};
