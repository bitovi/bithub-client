steal('can',
	  './init.mustache',
	  function(can, initView){

		  return can.Control(
			  {
				  defaults : {}
			  }, {
				  init : function( elem, opts ){
					  Bithub.Models.Event.findOne({ id: can.route.attr('id') }, function(event) {
						  elem.html( initView({
							  event: event
						  }));
					  });
				  }
				  
			  });
	  });
