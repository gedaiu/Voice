var fs = require('fs');
var path = require('path');
var mm = require('musicmetadata');
var async = require('async');
var _ = require('lodash');

var request = require('request');
var htmlparser = require("htmlparser2");

function decodeShow(showId, title, file, callback) {
  var list = [];
  var ids = [];
  var lastTag = "";
  var duration = 0;
  var oldStart = 0;

  request('http://wfmu.org/playlists/shows/' + showId  + '/starttimes.xml', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var parser = new htmlparser.Parser({
        onopentag: function(name, attribs) {
          if(name === "segment") {
            ids.push("wfmu-" + showId + "-" + oldStart);

            list.push({
              type: "remote",
              id: "wfmu-" + showId + "-" + oldStart,

              url: file,

              title: "unknown",
              artist: "unknown",
              album: "unknown",
              year: "unknown",
              duration: 0,
            });
          } else if (["title", "artist", "album"].indexOf(name) !== -1) {
            lastTag = name;
          } else if(name === "starttime") {
            duration = (parseInt(attribs.msec) - oldStart) / 1000;
            oldStart = parseInt(attribs.msec);
            lastTag = "starttime";
          }
        },

        ontext: function(text) {
          if(lastTag !== "") {
            if(lastTag === "starttime") {
              if(list.length >= 2) {
                list[list.length - 2].duration = duration;
              }

              list[list.length - 1].position = oldStart / 1000;
            } else {
              list[list.length - 1][lastTag] = text;
            }
          }
      	},

        onclosetag: function(name, attribs){
          lastTag = "";
        },
      }, { decodeEntities: true });

      parser.write(body);
      parser.end();

      callback(null, {id: "wfmu-" + showId, type: "playlist", author: "WFMU This is the modern world", title: title, list: ids }, list);
    }
  });
}

function getAudioFromM3u(lastShowId, title, href, callback) {
  request('https://wfmu.org' + href, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      files = body.split("\n");
      var path = null;

      files.forEach(function(file) {
        if(file.indexOf(".mp3") != -1) {
          path = file;
        }
      });

      if(path) {
        callback(lastShowId, title, path);
      }
    }
  });
}

module.exports = {
  setLocalSource: function() { },

  get: function(callback) {
    var lastShowId = 0;
    var lastTitle = "unknown";
    var isTitle = false;

    request('https://wfmu.org/playlists/LM', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var parser = new htmlparser.Parser({
          onopentag: function(name, attribs){
            if(name === "a" && attribs.href && attribs.href.indexOf("/playlists/shows/") === 0) {
              lastShowId = attribs.href.substr("/playlists/shows/".length);
            }

            if(name === "a" && attribs.href && attribs.href.indexOf("/listen.m3u?show=" + lastShowId + "&") === 0) {
              getAudioFromM3u(lastShowId, lastTitle, attribs.href, function(lastShowId, lastTitle, url) {
                decodeShow(lastShowId, lastTitle, url, function(err, playlist, list) {
                  callback(null, playlist);

                  list.forEach(function(file) {
                    callback(null, file);
                  });
                });
              });
            }

            if(name === "b") {
              isTitle = true;
            }
          },
          ontext: function(text) {
            if(isTitle) {
              lastTitle = text;
              isTitle = false;
            }
          }
        }, { decodeEntities: true });

        parser.write(body);
        parser.end();
      }
    });
  },

  play: function(song) {
    console.log("play ", song);
  }
};
