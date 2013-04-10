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
				  defaults : {
					  views: {
						  latest: {order: 'origin_ts:desc'},
						  greatest: {order: 'votes:desc'}
					  }
				  }
			  },
			  /** @Prototype */
			  {
				  init : function(){
					  var self = this;

					  self.options.views = {
						  latest: function( params ) {
							  Events.findAll( can.extend( {order: 'origin_ts:desc'}, params || {} ),
											  function( data ) {
												  data = $.groupBy( data, ['origin_date', 'category'] );
												  self.element.html( initView({days: data}) );
											  });
						  },
						  greatest: function( params ) {
							  Events.findAll( can.extend( {order: 'id:desc'}, params || {} ), // TEMP: 'votes:desc'
											  function (data) {
												  self.element.html( initView({events: data}) );
											  });
						  }
					  };

					  self.options.views.latest();
				  },

				  '.voteup click': function (el, ev) {
					  var event = can.data(el.closest('.event'), 'event');

					  event.upvote(function () {
						  event.attr('upvotes', event.attr('upvotes') + 1);
					  });
				  },

				  '{currentState} change': function(currentState, ev, attr, method, newVal) {
					  if (this.options.views[currentState.view]) {
						  var params = {};
						  
						  if (currentState.attr('project')) { params.tag = currentState.attr('project'); }
						  if (currentState.attr('category')) { params.category = currentState.attr('category'); }

						  // render view
						  this.options.views[currentState.view]( params );
					  } else {
						  // if there is no available 'view' then hide yourself?
					  }
				  }

			  });
	  });
