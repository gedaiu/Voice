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

var plugins = [];

module.exports = {
  init: function() {
    var path = __dirname + "/collections";

    fs.readdir(path, function(err, list) {
      var jsFiles = _.filter(list, function(file) { return file.lastIndexOf(".js") === file.length - 3; });

      jsFiles.forEach(function(file) {
        plugins.push(require(path + "/" + file));
      });
    });
  },

  setLocalSource: function(location) {
    plugins.forEach(function(plugin) {
      plugin.setLocalSource(location);
    });
  },

  get: function(callback) {
    plugins.forEach(function(plugin) {
      plugin.get(callback);
    });
  },

  play: function(song) {
    console.log("play ", song);
  }
};
