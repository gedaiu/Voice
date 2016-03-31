var LastFmNode = require('lastfm').LastFmNode;

var lastfm = new LastFmNode({
  api_key: 'c7f2b085c72205867cbf6a560bce0408',
  secret: '67f834abbb1039230c9083e9b4f784e2',
  useragent: 'Voice/v0.1 Voice'
});


function fillArtistCover(audioData, callback) {
  var request = lastfm.request("artist.getInfo", {
    artist: audioData.artist,

    handlers: {
      success: function(data) {
        console.log("data.artist.image: ", data.artist.image);

        var images = data.artist.image;

        if(images) {
          audioData.cover = images[images.length - 1]["#text"];
        }

        callback(null, audioData);
      }
    }
  });
}


module.exports = {
  get: function(audioData, callback) {
    var request = lastfm.request("track.getInfo", {
      track: audioData.title,
      artist: audioData.artist,

      handlers: {
          success: function(data) {
            if(data.track.name) {
              audioData.title = data.track.name;
            }

            if(data.track.artist && data.track.artist.name) {
              audioData.artist = data.track.artist.name;
            }

            if(data.track.album && data.track.album.image) {
              var images = data.track.album.image;
              audioData.cover = images[images.length - 1]["#text"];
            }

            if(audioData.cover) {
              callback(null, audioData);
            } else {
              fillArtistCover(audioData, callback);
            }
          },
          error: function(error) {
              console.log("Error:", error.message);
          }
      }
    });
  }
};
