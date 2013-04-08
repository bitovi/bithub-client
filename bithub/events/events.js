steal('can',
	  './init.mustache',
	  'bithub/models/event.js',
	  'can/view/mustache',
	  function(can, initView, Event){
		  /**
		   * @class bithub/events
		   * @alias Events
		   */
		  return can.Control(
			  /** @Static */
			  {
				  defaults : {}
			  },
			  /** @Prototype */
			  {
				  init : function(){
					  var self = this;
					  
					  Event.latest({},
								   function(data) {
									   self.element.html(initView({
										   days: data
									   }));									   
								   },
								   function(err) {
									   console.log("Error HTTP status: " + err.status);
								   });
					  
				  }
			  });
	  });
