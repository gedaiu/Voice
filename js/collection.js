var $ = require(__dirname+'/js/vendor/jquery-2.1.3.min.js');

$(function() {

  $(".collectionButton").click(function() {
    $(this).parent().toggleClass("open");
    $(".mainView").toggleClass("contract");
  });

});
