steal('can',
	  './init.mustache',
	  function(can, initView){
		  
		  return can.Control.extend({
			  defaults : {}
		  }, {
			  init : function( elem, opts ){
				  this.element.html(initView({
					  user: opts.currentUser
				  }));
			  }
		  });
	  });
