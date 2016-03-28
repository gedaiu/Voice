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


function fileList(list) {
  $(".collection .list").html("");

  list.forEach(function(fileData) {
    var item = $('<div draggable="true" class="item"><span class="title">' + fileData.title + '</span><span class="artist">by ' + fileData.artist + '</span><span class="duration">' + fileData.duration + '</span></div>');
    $(".collection .list").append(item);

    item.on("dragstart", function(event) {
      event.originalEvent.dataTransfer.setData("voiceItemData", JSON.stringify(fileData));
      event.originalEvent.dataTransfer.setData("text", fileData.artist + " - " + fileData.title);
    });
  });
}
