var $ = require(__dirname+'/js/vendor/jquery-2.1.3.min.js');
const ipcRenderer = require('electron').ipcRenderer;

$(function() {
  $(".collectionButton").click(function() {
    $(this).parent().toggleClass("open");
    $(".mainView").toggleClass("contract");
  });

  $(".selectSources").click(function() {
    ipcRenderer.send('asynchronous-message', JSON.stringify({ action: "selectLocalSource"}));
  });
});

function fileClear(list) {
  $(".collection .list .group").hide();
  $(".collection .list .group .items").html("");
}

function fileItem(fileData) {
    var item = null;
    var duration = "";

    if(fileData.type === "playlist") {
      var artist = fileData.author ? fileData.author + ": " : "";
      item = $('<div draggable="true" class="item"><span class="title">' + fileData.title + '</span><span class="artist">' + artist + fileData.list.length + ' songs</span></div>');

      $(".collection .list .group[data-type='playlist']").show();
      $(".collection .list .group[data-type='playlist'] .items").append(item);
    }

    if(fileData.type === "remote") {
      duration = fileData.duration && fileData.duration ? niceTime(fileData.duration) : "";

      item = $('<div draggable="true" class="item"><span class="title">' + fileData.title + '</span><span class="artist">by ' + fileData.artist + '</span><span class="duration">' + duration + '</span></div>');

      $(".collection .list .group[data-type='remote']").show();
      $(".collection .list .group[data-type='remote'] .items").append(item);
    }

    if(fileData.type === "file") {
      duration = fileData.duration && fileData.duration ? niceTime(fileData.duration) : "";

      item = $('<div draggable="true" class="item"><span class="title">' + fileData.title + '</span><span class="artist">by ' + fileData.artist + '</span><span class="duration">' + duration + '</span></div>');

      $(".collection .list .group[data-type='file']").show();
      $(".collection .list .group[data-type='file'] .items").append(item);
    }

    if(item) {
      item.on("dragstart", function(event) {
        event.originalEvent.dataTransfer.setData("voiceItemData", JSON.stringify(fileData));
        event.originalEvent.dataTransfer.setData("text", fileData.artist + " - " + fileData.title);
      });
    }
}
