var MusicPlayer = MusicPlayer || {};
var $ = require(__dirname+'/js/vendor/jquery-2.1.3.min.js');

MusicPlayer.Player = {
  audio: null
};

MusicPlayer.Player.play = function(data) {
  if(this.audio) {
    this.audio.pause();
  }

  if(data && data.path) {
    this.audio = new Audio(data.path);

    $(this.audio).on("timeupdate", () => {
      if(this.onTime) {
        this.onTime(this.audio.currentTime, this.audio.duration);
      }
    });
  }

  this.audio.play();
};

MusicPlayer.Player.pause = function(data) {
  if(this.audio) {
    this.audio.pause();
  }
};

MusicPlayer.Player.stop = function(data) {
  if(this.audio) {
    this.audio.pause();
    this.audio.currentTime = 0;
  }
};

MusicPlayer.Player.seek = function(percent) {
  if(this.audio) {
    this.audio.currentTime = this.audio.duration * percent;
  }
};
