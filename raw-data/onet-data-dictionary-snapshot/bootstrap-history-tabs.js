+function ($) {
    'use strict';
    $.fn.historyTabs = function() {
        var that = this;
        window.addEventListener('popstate', function(event) {
            if (event.state) {
                $(that).filter('[href="' + event.state.url + '"]').each(function(index, element) {
                  bootstrap.Tab.getInstance(element).show();
                });
            }
        });
        return this.each(function(index, element) {
            // Handle bookmarks referencing content in tabs
            if (window.location.hash) {
              var el = document.getElementById(window.location.hash.substring(1));
              if (el) {
                var $parent = $(el).parents($(element).attr('href'));
                if ($parent.length) {
                  var inst = bootstrap.Tab.getInstance(element);
                  if (inst) { inst.show(); }
                  window.setTimeout(function() { el.scrollIntoView(); }, 1000);
                }
              }
            }
            
            // Update history when tabs are switched
            $(element).on('show.bs.tab', function() {
                var stateObject = {'url' : $(this).attr('href')};

                if (window.location.hash && stateObject.url !== window.location.hash) {
                    window.history.pushState(stateObject, document.title, window.location.pathname + $(this).attr('href'));
                } else {
                    window.history.replaceState(stateObject, document.title, window.location.pathname + $(this).attr('href'));
                }
            });
            
            // Handle bookmarks referencing tabs
            if (!window.location.hash && $(element).is('.active')) {
                // Shows the first element if there are no query parameters.
                var inst = bootstrap.Tab.getInstance(element);
                if (inst) { inst.show(); }
            } else if ($(this).attr('href') === window.location.hash) {
                var inst = bootstrap.Tab.getInstance(element);
                if (inst) { inst.show(); }
            } else if ($(this).attr('data-redirects')) {
                var redirs = $(this).attr('data-redirects').split('\n');
                if (redirs.indexOf(window.location.hash.substring(1)) > -1) {
                    var inst = bootstrap.Tab.getInstance(element);
                    if (inst) { inst.show(); }
                }
            }
        });
    };
}(jQuery);
