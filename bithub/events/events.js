steal('can',
	  './init.mustache',
	  './latest.mustache',
	  './greatest.mustache',
	  'bithub/models/event.js',
	  'bithub/models/upvote.js',
	  'can/construct/proxy',
	  'vendor/moment',
	  function(can, initView, latestView, greatestView, Event, Upvote){
		  /**
		   * @class bithub/events
		   * @alias Events
		   */
		  var defaultParams = {
			  latest: {order: 'origin_ts:desc'},
			  greatest: {order: 'id:desc'}
		  };
		  
		  return can.Control(
			  /** @Static */
			  {
				  defaults : {}
			  },
			  /** @Prototype */
			  {
				  init : function(){
					  var self = this;

					  this.events = new Bithub.Models.Event.List();
					  this.currentView = can.compute('latest');

					  this.element.html( initView({
						  data: function() {
							  if (self.currentView() === 'latest') {
								  return self.events.latest();
							  } else {
								  return self.events;
							  }
						  },
						  partial: this.currentView
					  }, {
						  isLatest: function( partial, opts ) {
							  return partial() === 'latest' ? opts.fn(this) : '';
						  },
						  isGreatest: function( partial, opts ) {
							  return partial() === 'greatest' ? opts.fn(this) : '';
						  }
					  }) );

					  // helpers passed to mustache view aren't accessable in partials? 
					  can.Mustache.registerHelper('isCategory', function( category, opts ) {
							  return category === this.key ? opts.fn(this) : '';
						  });

					  this.load();
				  },

				  '.voteup click': function (el, ev) {
					  can.data(el.closest('.event'), 'event').upvote();
				  },

				  '{currentState} change': function(currentState, ev, attr, method, newVal) {
					  clearTimeout(this.stateTimeout);

					  this.stateTimeout = setTimeout(this.proxy(function () {
						  var params = {};

						  if (currentState.attr('project')) { params.tag = currentState.attr('project'); }
						  if (currentState.attr('category')) { params.category = currentState.attr('category'); }

						  // render view
						  this.load(params);
					  }), 0);
				  },

				  load: function( params ) {
					  Event.findAll( can.extend({}, defaultParams[this.options.currentState.view], params || {} ),
									  this.proxy('updateEvents')
									);

				  },

				  updateEvents: function( events ) {
					  this.currentView( this.options.currentState.view );
					  this.events.replace(events);
				  }

			  });
	  });
