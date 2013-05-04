steal('can',
	  './init.mustache',
	  './latest.mustache',
	  './greatest.mustache',
	  './_digest.mustache',
	  './_event.mustache',
	  './_event_children.mustache',
	  './_event_code.mustache',
	  './_event_twitter.mustache',
	  './_event_irc.mustache',
	  'bithub/models/event.js',
	  'bithub/models/upvote.js',
	  'can/construct/proxy',
	  'bithub/helpers/mustacheHelpers.js',
	  function(can, initView, latestView, greatestView, digestPartial, eventPartial, eventChildrenPartial, eventCodePartial, eventTwitterPartial, eventIRCPartial, Event, Upvote){
		  /**
		   * @class bithub/events
		   * @alias Events
		   */
		  var defaultParams = {
			  latest: {order: 'origin_ts:desc'},
			  greatest: {order: 'upvotes:desc'},
			  eventPartialsLookup: [
				  {
					  template: eventCodePartial,
					  tags: ['push_event']
				  }, {
					  template: eventTwitterPartial,
					  tags: ['status_event']
				  }, {
					  template: eventIRCPartial,
					  tags: ['irc']
				  }
			  ],
			  latestCategories: ['twitter','bug', 'comment', 'feature', 'question', 'article', 'plugin', 'app', 'code']
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
						  categories: defaultParams.latestCategories,
						  partial: this.currentView
					  }, {
						  'partials': {
							  latestView: latestView,
							  greatestView: greatestView,
							  digestPartial: digestPartial,
							  eventChildrenPartial: eventChildrenPartial,
							  eventPartial: function( data, helpers ) {
								  return (self.determineEventPartial(data)).render( data, helpers );
							  }
						  },
						  'helpers': {
							  isLatest: function( partial, opts ) {
								  return partial() === 'latest' ? opts.fn(this) : '';
							  },
							  isGreatest: function( partial, opts ) {
								  return partial() === 'greatest' ? opts.fn(this) : '';
							  },
							  iterByKeys: function( obj, keys, opts ) {
								  var buffer = "";
								  can.each(keys, function (key) {
									  if (obj[key]) {
										  buffer += opts.fn( {key: key, values: obj[key]} );
									  }
								  });
								  return buffer;
							  }
						  }
					  }) );

					  this.load();
				  },

				  '.expand-replies click': function( el, ev ) {
					  el.find('span.icon').toggleClass('collapse').closest('.event').find('.replies').toggle();
				  },
				  
				  '.voteup click': function( el, ev ) {
					  can.data(el.closest('.event'), 'event').upvote();
				  },

				  '{window} onbottom': function( el, ev ) {
					  //this.options.currentState.attr('offset', this.options.currentState.offset + this.options.currentState.limit);
				  },

				  '{can.route} view': function( data, ev, newVal, oldVal ) {
					  this.load( this.prepareParams( data ) );
				  },
				  
				  '{can.route} project': function( data, ev, newVal, oldVal ) {
					  this.load( this.prepareParams( data ) );
				  },
				  
				  '{can.route} category': function( data, ev, newVal, oldVal ) {
					  this.load( this.prepareParams( data ) );
				  },

				  prepareParams: function( data ) {
					  var params = {};
					  if( data.attr('project') && data.attr('project') !== 'all' ) {
						  params.tag = data.attr('project');
					  }
					  if( data.attr('category') && data.attr('category') !== 'all' ) {
						  params.category = data.attr('category');
					  }

					  return params;
				  },
				  
				  determineEventPartial: function( event ) {
					  var template = eventPartial, //default
						  bestScore = 0;

					  can.each( defaultParams.eventPartialsLookup, function( partial ) {
						  var score = 0;
						  
						  event.attr('tags').each(function( tag ) {
							  if (partial.tags.indexOf(tag) >= 0) score++;
						  });
						  
						  if (score > bestScore) template = partial.template;
					  } );
					  
					  return template;
				  },
				  				  
				  load: function( params ) {
					  clearTimeout(this.loadTimeout);

					  this.loadTimeout = setTimeout( this.proxy( function () {
						  Event.findAll( can.extend({}, defaultParams[can.route.attr('view')], params || {} ),
										 this.proxy('updateEvents')
									   );
					  }));
				  },

				  updateEvents: function( events ) {
					  this.currentView( can.route.attr('view') );
					  this.events.replace(events);
				  }

			  });
	  });
