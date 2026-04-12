(function( $ ){

  var methods = {
     init : function( options ) {
     
       return this.each(function(){
         
         var $this = $(this),
             data = $this.data('linktrack');
         
         // If the plugin hasn't been initialized yet
        if ( ! data ) {
          
          $this.data('linktrack', {
            target : $this,
            options : (options == null ? new Object() : options),
            jqxhr : null
          });
                             
          $this.on('click.linktrack', function(event) {
            var $t = $(event.currentTarget);
            var data = $t.data('linktrack');
            if (!data) { return; }
            if (data.jqxhr) { return; }
            
            var url = $t.data('target');
            if (!url) { return; }
            
            url += (url.includes('?') ? '&' : '?') + 'date=' + Date.now();
            data.jqxhr = $.ajax({
                url : url,
                timeout : 500
              });
          });
         }
       });
     },
     destroy : function( ) {

       return this.each(function(){

         var $this = $(this);
         var data = $this.data('linktrack');
         if (!data) { return; }
         
         $this.removeData('linktrack');
       })

     },
     update : function( content ) { }
  };

  $.fn.linktrack = function( method ) {
    
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.linktrack' );
    }
  
  };

})( jQuery );
