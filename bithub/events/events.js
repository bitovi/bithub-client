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

		  var views = {
			  latest: new can.Observe( {order: 'origin_ts:desc'} ),
			  greatest: new can.Observe( {order: 'upvotes:desc', offset: 0, limit: 50} )
		  },
			  filter = new can.Observe({}),
				  
			  eventPartialsLookup = [
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
			  latestCategories = ['twitter','bug', 'comment', 'feature', 'question', 'article', 'plugin', 'app', 'code'];
			  
		  return can.Control(
			  /** @Static */
			  {
				  defaults : {}
			  },
			  /** @Prototype */
			  {
				  init : function(){
					  var self = this;

					  this.latestEvents = new Bithub.Models.Event.List();
					  this.greatestEvents = new Bithub.Models.Event.List();
					  this.currentView = can.compute('latest');
					  
					  this.element.html( initView({
						  latestEvents: self.latestEvents,
						  greatestEvents: self.greatestEvents,
						  categories: latestCategories,
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

				  '.votes click': function( el, ev ) {
					  var event = can.data(el.closest('.reply-event'), 'event');
					  (new Upvote({event: event})).upvote();
				  },

				  '{can.route} view': function( data, ev, newVal, oldVal ) {
					  this.load();
				  },
				  
				  '{can.route} project': function( data, ev, newVal, oldVal ) {
					  newVal !== 'all' ? filter.attr('project', newVal) : filter.removeAttr('project');
					  this.load();
				  },
				  
				  '{can.route} category': function( data, ev, newVal, oldVal ) {
					  newVal !== 'all' ? filter.attr('category', newVal) : filter.removeAttr('category');
					  this.load();
				  },
				  
				  '{window} onbottom': function( el, ev ) {
					  // todo: check view
					  views.attr('greatest').offset += views.attr('greatest').limit;
				  },

				  determineEventPartial: function( event ) {
					  var template = eventPartial, //default
						  bestScore = 0;

					  can.each( eventPartialsLookup, function( partial ) {
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
						  Event.findAll( can.extend({}, views[can.route.attr('view')].attr(), filter.attr(), params || {} ) ,
										 this.proxy('updateEvents')
									   );
					  }));
				  },

				  updateEvents: function( events ) {

					  // update data according to selected view
					  if (can.route.attr('view') === 'latest') {
						  this.latestEvents.replace(events.latest());
					  } else {
						  this.greatestEvents.replace(events);
					  }

					  // switch view
					  this.currentView( can.route.attr('view') );
				  },

				  appendEvents: function( events ) {
				  }

			  });
	  });
