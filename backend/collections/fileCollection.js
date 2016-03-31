var fs = require('fs');
var path = require('path');
var mm = require('musicmetadata');
var async = require('async');
var _ = require('lodash');

var source = null;

var walk = function(dir, done) {
  var results = [];

  fs.readdir(dir, function(err, list) {
    if (err) {
      return done(err);
    }

    var pending = list.length;

    if (!pending) {
      return done(null, results);
    }

    list.forEach(function(file) {
      file = path.resolve(dir, file);

      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);

            if (!--pending) {
              done(null, results);
            }
          });
        } else {
          results.push(file);
          if (!--pending) {
            done(null, results);
          }
        }
      });
    });
  });
};

function expandMp3(file, callback) {
    var parser = mm( fs.createReadStream(file), function (err, result) {
      var meta = {
        type: "file",
        id: file,

        title: result.title || "unknown",
        artist: result.artist.join(" ") || "unknown",
        album: result.album || "unknown",
        year: result.year || "unknown",
        duration: result.duration,

        path: file
      };

      if(result.picture && result.picture.length > 0) {
        var format = result.picture[0].format;
        var buffer = result.picture[0].data;
        var filename = meta.artist + "-" + meta.title + "." + format;
        filename = filename.replace(/(["\s'$`\\\/])/g, "_");

        fs.access("covers/" + filename, fs.R_OK | fs.W_OK, function(err) {
          if(err) {
            fs.writeFile("covers/" + filename, buffer);
          }
        });

        meta.cover = "./covers/" + filename;
      }

      callback(null, meta);
    });
}

module.exports = {
  setLocalSource: function(location) {
    source = location;
  },

  get: function(callback) {
    if(!source) {
      return callback(null, []);
    }

    walk(source, function(err, results) {
      var mp3Files = _.filter(results, function(file) { return file.lastIndexOf(".mp3") === file.length - 4; });
      async.map(mp3Files, function(item) {
        expandMp3(item, function(err, data) {
          if(!err) {
            callback(null, data);
          }
        });
      });
    });
  },

  play: function(song) {
    console.log("play ", song);
  }
};
