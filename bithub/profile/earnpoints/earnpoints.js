steal('can',
	  './init.mustache',
	  '../_navbar.mustache',
	  function(can, initView, navbarPartial){
		  return can.Control.extend({
				  defaults : {}
			  }, {
				  init : function(){
					  this.element.html(initView({
						  message: "Earn points"
					  }, {
						  helpers: {},
						  partials: {
							  navbarPartial: navbarPartial
						  }
					  }));
				  }
			  });
	  });
