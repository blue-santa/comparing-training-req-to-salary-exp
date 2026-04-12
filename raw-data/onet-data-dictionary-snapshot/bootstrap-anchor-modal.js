+function ($) {
  'use strict';
  $.fn.anchorModal = function() {
    var that = this;
    window.addEventListener('popstate', function(event) {
      if (event.state && event.state.url && event.state.url.startsWith('#')) {
        that.each(function(idx, el) {
          if (event.state.url === '#' + $(el).data('apAnchor')) {
            var popup = $(el).data('apModalTarget');
            bootstrap.Modal.getOrCreateInstance($(popup)[0]).show(el);
          }
        });
      }
    });
    return this.each(function(idx, el) {
      // Handle bookmarks
      if (window.location.hash && window.location.hash === '#' + $(el).data('apAnchor')) {
        var popup = $(el).data('apModalTarget');
        bootstrap.Modal.getOrCreateInstance($(popup)[0]).show(el);
      }
    });
  };
}(jQuery);
