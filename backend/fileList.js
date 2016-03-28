var fs = require('fs');
var path = require('path');
var id3 = require('id3js');
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
  try {
    id3({ file: file, type: id3.OPEN_LOCAL }, function(err, tags) {

      if(!tags) {
        tags = {};
      }

      callback(null, {
        title: tags.title || "unknown",
        artist: tags.artist || "unknown",
        album: tags.album || "unknown",
        year: tags.year || "unknown",
        duration: "00:00",

        path: file
      });
    });
  } catch(err) {

  }
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
      async.map(mp3Files, expandMp3, callback);
    });
  }
};
