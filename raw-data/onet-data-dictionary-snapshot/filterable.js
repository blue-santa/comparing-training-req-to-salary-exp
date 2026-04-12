+function ($) {
  'use strict';
  
  $.fn.filterable = function (options) {
    return this.each(function () {
      var $root = $(this);
      
      var defaults = {
        params: []
      };
      
      var settings = $.extend({}, defaults, options);
      
      if (typeof $root.data('params') !== "undefined") {
        settings.params = $root.data('params').split(' ');
      }
      
      var filters = settings.params;
      var currentFilters = {};

      var readUrl = function () {
        for (var i = 0; i < filters.length; i++) {
          currentFilters[filters[i]] = $.QueryString[filters[i]] || '';
        }
      };
      var buildUrl = function () {
        var qstring = '';
        for (var i = 0; i < filters.length; i++) {
          if (currentFilters[filters[i]] !== '') {
            if (qstring !== '') {
              qstring += '&';
            }
            qstring += encodeURIComponent(filters[i]) + '=' + encodeURIComponent(currentFilters[filters[i]]);
          }
        }
        var newUrl = window.location.pathname;
        if (qstring !== '') {
          newUrl += '?' + qstring;
        }
        return newUrl;
      };
      var updateUrl = function () {
        var url = buildUrl();
        history.pushState(currentFilters, '', url);
      };

      var escapeForSelector = function (text) {
        // FIXME - use CSS.escape polyfill or similar
        return text;
      };

      var readForm = function () {
        for (var i = 0; i < filters.length; i++) {
          currentFilters[filters[i]] = $root.find('.filterform :input[name="' + escapeForSelector(filters[i]) + '"]').val() || '';
        }
      };
      var updateForm = function () {
        for (var i = 0; i < filters.length; i++) {
          $root.find('.filterform :input[name="' + escapeForSelector(filters[i]) + '"]').val(currentFilters[filters[i]]);
        }
      };

      var readLink = function ($el) {
        for (var i = 0; i < filters.length; i++) {
          currentFilters[filters[i]] = $el.attr('data-' + escapeForSelector(filters[i])) || '';
        }
      };

      var applyFilters = function () {
        var $filts = $root.find('.filterable');
        $filts.show();
        for (var i = 0; i < filters.length; i++) {
          var v = currentFilters[filters[i]];
          if (v !== '') {
            $filts.not('[data-' + escapeForSelector(filters[i]) + '~="' + escapeForSelector(v) + '"]').hide();
          }
        }
        var count = $filts.filter(':visible').length;
        $root.find('.filtercount').text(count.toLocaleString('en-US'));
      };
      
      // init
      readUrl();
      updateForm();
      applyFilters();
      
      $root.find('.filterform').submit(function (event) {
        event.preventDefault();
        readForm();
        applyFilters();
        updateUrl();
      });
      $root.find('.filterlink').click(function (event) {
        event.preventDefault();
        readLink($(this));
        updateForm();
        applyFilters();
        updateUrl();
        $root[0].scrollIntoView();
      });
      window.onpopstate = function (event) {
        currentFilters = {};
        for (var i = 0; i < filters.length; i++) {
          if (history.state && history.state[filters[i]] !== null) {
            currentFilters[filters[i]] = history.state[filters[i]];
          } else {
            currentFilters[filters[i]] = '';
          }
        }
        updateForm();
        applyFilters();
      };

    });
  };
}(jQuery);
