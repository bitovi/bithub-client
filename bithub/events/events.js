steal('can',
	  './init.mustache',
	  'bithub/models/event.js',
	  'can/view/mustache',
	  function(can, initView, Events){
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
					  
					  Events.findAll({order: 'origin_ts:desc'},
								   function(data) {
									   
									   self.element.html(initView({
										   days: $.groupBy( data, ['origin_date', 'category'] )
									   }));									   
								   },
								   function(err) {
									   console.log("Error HTTP status: " + err.status);
								   });					  
				  },

				  '.voteup click': function (el, ev) {
					  var event = can.data(el.closest('.event'), 'event');

					  event.upvote(function () {
						  event.attr('upvotes', event.attr('upvotes') + 1);
					  });
				  },

				  '{currentState} change': function(currentState, ev, attr, method, newVal) {
					  console.log(attr + " set to " + newVal);
				  }


			  });
	  });
