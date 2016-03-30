var MusicPlayer = MusicPlayer || {};
var $ = require(__dirname+'/js/vendor/jquery-2.1.3.min.js');

MusicPlayer.Player = {
  audio: null
};

MusicPlayer.Player.play = function(data) {
  if(this.audio) {
    this.audio.pause();
  }

  if(data && (data.path || data.url)) {
    var path = data.path || data.url;

    if(!this.audio || this.audio.currentSrc != path) {
      this.audio = new Audio(path);

      $(this.audio).on("timeupdate", () => {
        if(this.onTime) {
          var currentTime = this.audio.currentTime;
          var duration = this.audio.duration;

          if(this.audio.dataPosition) {
            currentTime -= this.audio.dataPosition;
          }

          if(this.audio.dataDuration) {
            duration = this.audio.dataDuration;
          }

          this.onTime(currentTime, duration);

          if(currentTime >= duration) {
            this.audio.pause();
            this.onEnd();
          }
        }
      });
    }

    if(data.position) {
      this.audio.currentTime = data.position;
      this.audio.dataPosition = data.position;
    } else {
      this.audio.currentTime = 0;
    }

    if(data.duration) {
      this.audio.dataDuration = data.duration;
    }
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
    var duration = this.audio.dataDuration ? this.audio.dataDuration : this.audio.duration;
    var currentTime = duration * percent;

    if(this.audio.dataPosition) {
      currentTime += this.audio.dataPosition;
    }

    this.audio.currentTime = currentTime;
  }
};
