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
					  
					  Event.findAll({order: 'origin_ts:desc'},
								   function(data) {
									   self.element.html(initView({
										   days: $.groupBy( data, ['origin_date', 'category'] )
									   }));									   
								   },
								   function(err) {
									   console.log("Error HTTP status: " + err.status);
								   });					  
				  },
				  
				  '{currentState} change': function(currentState, ev, attr, method, newVal) {
					  console.log(attr + " set to " + newVal);
				  }

			  });
	  });
