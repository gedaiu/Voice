var MusicPlayer = MusicPlayer || {};

var $ = require(__dirname+'/js/vendor/jquery-2.1.3.min.js');
const ipcRenderer = require('electron').ipcRenderer;

MusicPlayer.Collection = {
  data: []
};


$(function() {
  $(".collectionButton").click(function() {
    $(this).parent().toggleClass("open");
    $(".mainView").toggleClass("contract");
  });

  $(".selectSources").click(function() {
    ipcRenderer.send('asynchronous-message', JSON.stringify({ action: "selectLocalSource"}));
  });
});

MusicPlayer.Collection.fileClear = function(list) {
  MusicPlayer.Collection.data = [];

  $(".collection .list .group").hide();
  $(".collection .list .group .items").html("");
};

MusicPlayer.Collection.getElement = function(id, type) {
  var item = $(".collection .list .item[data-id='" + id + "']");

  if(item.length === 0) {
    var template = '<span class="title"></span><span class="artist"></span><span class="duration"></span><span class="info"></span>';
    item = $('<div draggable="true" class="item" data-id="' + id + '">' + template + '</div>');

    $(".collection .list .group[data-type='" + type + "']").show().append(item);
  }

  return item;
};

MusicPlayer.Collection.addCollectionItem = function(fileData) {
  var element = this.getElement(fileData.id, fileData.type);
  var duration = fileData.duration && fileData.duration ? niceTime(fileData.duration) : "";

  element.find(".title").html(fileData.title);
  element.find(".artist").html(fileData.artist);
  element.find(".duration").html(fileData.duration);
  element.find(".info").html(fileData.info);

  element.off("dragstart");
  element.on("dragstart", function(event) {
    event.originalEvent.dataTransfer.setData("voiceItemData", JSON.stringify(fileData.list || fileData.id));
  });

  return element;
};

MusicPlayer.Collection.fileItem = function(fileData) {
    MusicPlayer.Collection.data[fileData.id] = fileData;
    this.addCollectionItem(fileData);
};
