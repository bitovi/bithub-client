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
	  'bithub/models/award.js',
	  'can/construct/proxy',
	  'bithub/helpers/mustacheHelpers.js',
	  function(can, initView, latestView, greatestView, digestPartial, eventPartial, eventChildrenPartial, eventCodePartial, eventTwitterPartial, eventIRCPartial, Event, Upvote, Award){

		  var latestTimespan = new can.Observe({ endDate: moment(), startDate: moment().subtract('days', 1) }),
			  
			  latestDateFilter = can.compute(function () {
				  return latestTimespan.attr('startDate').format('YYYY-MM-DD') + ':' + latestTimespan.attr('endDate').format('YYYY-MM-DD');
			  }),

			  emptyReqCounter = 0,
			  emptyReqTreshold = 5,
			  
			  // lookup dict with default query params for loading events
			  views = {
				  latest: {
					  byDate: new can.Observe({
						  order: 'origin_ts:desc',
						  exclude: 'source_data',
						  origin_date: latestDateFilter,
						  limit: 1000 // override default 50
					  }),
					  byLimit: new can.Observe({
						  order: 'origin_ts:desc',
						  exclude: 'source_data',
						  offset: 0,
						  limit: 25
					  })
				  },
				  greatest: new can.Observe({
					  order: 'upvotes:desc',
					  exclude: 'source_data',
					  offset: 0,
					  limit: 25
				  })
			  },

			  // lookup table for dynamic loading of event partials 
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
			  
			  // used for ordering categories on latest view
			  latestCategories = ['twitter','bug', 'comment', 'feature', 'question', 'article', 'plugin', 'app', 'code'],


			  // template helpers
			  mustacheHelpers = {
				  isLatest: function( partial, opts ) {
					  return partial() === 'latest' ? opts.fn(this) : '';
				  },
				  isGreatest: function( partial, opts ) {
					  return partial() === 'greatest' ? opts.fn(this) : '';
				  },
				  iterCategories: function( opts ) {
					  var self = this;
					  var buffer = "";
					  can.each(latestCategories, function (category) {
						  if (self.attr(category)) {
							  buffer += opts.fn( {category: category, events: self.attr(category)} );
						  }
					  });
					  return buffer;
				  },
				  getUrl: function( opts ) {
					  return this.url || '#!eventdetails/' + this.id;
				  }
			  };
		  
		  return can.Control(
			  {
				  defaults : {}
			  }, {

				  init : function( elem, opts ){
					  var self = this;

					  window.latest = this.latestEvents = new Bithub.Models.Event.List(),
					  this.greatestEvents = new Bithub.Models.Event.List(),			
					  this.currentView = can.compute('latest');
					  
					  /* TODO: live updating
					  opts.socket && opts.socket.on('new_event', function( event ) {
						  console.log( event );
					  });
					   */
					  
					  this.element.html( initView({
						  latestEvents: self.latestEvents,
						  greatestEvents: self.greatestEvents,
						  partial: this.currentView
					  }, {
						  'partials': {
							  latestView: latestView,
							  greatestView: greatestView,
							  digestPartial: digestPartial,
							  eventChildrenPartial: eventChildrenPartial,
							  eventPartial: function( data, helpers ) {
								  data.categories = opts.categories;
								  data.projects = opts.projects;
								  return (self.determineEventPartial(data)).render( data, helpers );
							  }
						  },
						  'helpers': can.extend({}, mustacheHelpers, {
							  ifAdmin: function( opts ) {
								  return self.options.currentUser.attr('admin') ? opts.fn(this) : opts.inverse(this);
							  }
						  })
					  }) );

					  this.load();
				  },

				  /*
				   * Event handlers
				   */

				  '.expand-replies click': function( el, ev ) {
					  el.find('span.icon').toggleClass('collapse').closest('.event').find('.replies').toggle();
				  },
				  
				  '.voteup click': function( el, ev ) {
					  this.upvote( can.data(el.closest('.event'), 'event') );
					  //can.data(el.closest('.event'), 'event').upvote();
				  },

				  '.replies .votes click': function( el, ev ) {
					  this.upvote( can.data(el.closest('.reply-event'), 'event') );
					  //var event = can.data(el.closest('.reply-event'), 'event');
					  //(new Upvote({event: event})).upvote();
				  },

				  '.award-btn click': function( el, ev ) {
					  ev.preventDefault();

					  var event = can.data(el.closest('.reply-event'), 'event');
					  (new Award({event: event})).award();
				  },

				  '.expand-manage-bar click': function( el, ev ) {
					  ev.preventDefault();
					  el.closest('.event').find('.manage-bar').slideToggle();
				  },

				  '.manage-bar .tag-action click': function( el, ev ) {
					  ev.preventDefault();

					  var event = can.data(el.closest('.event'), 'event');
					  var tag = el.data('tag');
					  var tags = event.attr('tags');

					  (tags.indexOf(tag) >= 0) ? tags.splice(tags.indexOf(tag), 1) : tags.push(tag);
					  event.save();
				  },

				  '.manage-bar .category-action click': function( el, ev ) {
					  ev.preventDefault();

					  var event = can.data(el.closest('.event'), 'event');

					  event.attr('category', el.data('category'));
					  event.save();
				  },

				  '.delete-event click': function( el, ev ) {
					  ev.preventDefault();					  
					  (can.data( el.closest('.event'), 'event' )).destroy();
				  },

				  // can.route listeners

				  '{can.route} view': function( data, ev, newVal, oldVal ) {
					  this.resetFilter();
					  this.load( this.updateEvents );
				  },
				  
				  '{can.route} project': function( data, ev, newVal, oldVal ) {
					  this.resetFilter();
					  this.load( this.updateEvents );
				  },
				  
				  '{can.route} category': function( data, ev, newVal, oldVal ) {
					  this.resetFilter();
					  this.load( this.updateEvents );
				  },

				  // infinite scroll
				  
				  '{window} onbottom': function( el, ev ) {
					  if (can.route.attr('view') === 'latest') {
						  if (can.route.attr('project') !== 'all' || can.route.attr('category') !== 'all') {
							  views.latest.byLimit.attr('offset', views.latest.byLimit.offset + views.latest.byLimit.limit);
						  } else {
							  this.decrementLatestDate();
						  }
					  } else {
						  views.greatest.attr('offset', views.greatest.offset + views.greatest.limit);
					  }
					  this.load( this.appendEvents );
				  },

				  /*
				   * Functions
				   */

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
				  
				  decrementLatestDate: function() {
					  latestTimespan.attr({
						  endDate: latestTimespan.attr('endDate').subtract('days', 2),
						  startDate: latestTimespan.attr('startDate').subtract('days', 2)
					  });
				  },

				  resetFilter: function() {
					  latestTimespan.attr({
						  endDate: moment(),
						  startDate: moment().subtract('days', 1)
					  });
					  views.latest.byLimit.attr('offset', 0);
					  views.greatest.attr('offset', 0);
				  },

				  prepareParams: function( params ) {

					  // determine view
					  var view = views.greatest;
					  if( can.route.attr('view') === 'latest' ) {
						  view = (can.route.attr('project') !== 'all' || can.route.attr('category') !== 'all' ) ? views.latest.byLimit : views.latest.byDate;
					  }

					  // build query
					  var query = can.extend({}, view.attr(), params || {});

					  // append filters
					  if (can.route.attr('project') !== 'all') query.tag = can.route.attr('project');
					  if (can.route.attr('category') !== 'all') query.category = can.route.attr('category');

					  return query;
				  },
				  
				  load: function( cb, params ) {
					  clearTimeout(this.loadTimeout);

					  this.loadTimeout = setTimeout( this.proxy( function () {
						  Event.findAll( this.prepareParams(), this.proxy( cb ) );
					  }) );
				  },

				  updateLatest: function( events ) {
					  if (events.length == 0 && ++emptyReqCounter < emptyReqTreshold) {
						  this.decrementLatestDate();
						  this.load( this.updateLatest );
					  } else {
						  emptyReqCounter = 0;
						  this.latestEvents.replace( events.latest() );
					  }
					  this.currentView( can.route.attr('view') );
				  },
				  
				  appendLatest: function( events ) {
					  var buffer = new Bithub.Models.Event.List( this.latestEvents );
					  
					  $.each(events.latest(), function( i, day ) {
						  // merge with previous day or push new day
						  if (buffer[buffer.length-1].attr('date') === day.date) {
							  for( var category in day ) {
								  can.merge( buffer[buffer.length-1][category], day[category] );
							  };
						  } else {
							  buffer.push( day );
						  }
					  });					  
					  this.latestEvents.replace( buffer );
				  },
				  
				  updateGreatest: function( events ) {
					  this.greatestEvents.replace( events );
					  this.currentView( can.route.attr('view') );
				  },
				  
				  appendGreatest: function( events ) {
					  var buffer = new Bithub.Models.Event.List( this.greatestEvents );
					  events.forEach( function( event ) {
						  buffer.push( event );
					  });				  
					  this.greatestEvents.replace( buffer );
				  },

				  updateEvents: function( events ) {					  
					  (can.route.attr('view') === 'latest') ? this.updateLatest( events ) : this.updateGreatest( events );
					  window.scrollTo(0, 0);
				  },

				  appendEvents: function( events ) {
					  (can.route.attr('view') === 'latest') ? this.appendLatest( events ) : this.appendGreatest( events );
				  },

				  upvote: function( event ) {
					  if ( this.options.currentUser.attr('loggedIn') ) {
						  (new Upvote({event: event})).upvote();
					  } else {
						  this.options.modals.showLogin();
					  }
				  }

			  });
	  });
