var fs = require('fs');
var path = require('path');
var mm = require('musicmetadata');
var async = require('async');
var _ = require('lodash');

var audioInfo = require("./audioInfo");

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
      plugin.get(function(err, data) {
        if(data.type === "remote" || data.type === "file") {
          audioInfo.get(data, callback);
        }

        callback(err, data);
      });
    });
  },

  play: function(song) {
    console.log("play ", song);
  }
};
