$(function () {

  var showTransientMessage = function($btn, msg) {
    $btn.popover({
        trigger: 'manual',
        content: msg,
        placement: 'bottom'
       });
    $btn.popover('show');
    setTimeout(function() {
      $btn.popover('dispose');
    }, 5000);
  };

  var clip = new ClipboardJS('.copy-btn');
  clip.on('success', function(e) {
    var $btn = $(e.trigger);
    var msg = $btn.attr('data-success-msg');
    if (msg) { showTransientMessage($btn, msg); }
  });
  clip.on('error', function(e) {
    var $btn = $(e.trigger);
    var msg = $btn.attr('data-error-msg');
    if (msg) { showTransientMessage($btn, msg); }
  });

  $('.retired-anchor').anchorModal();

});
