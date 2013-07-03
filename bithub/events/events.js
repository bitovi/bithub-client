steal('can',
	  './init.ejs',
	  './latest.ejs',
	  './greatest.ejs',
	  './_event.ejs',
	  './_event_children.ejs',
	  './_event_code.ejs',
	  './_event_twitter.ejs',
	  './_digest.ejs',
	  'bithub/models/event.js',
	  'bithub/models/upvote.js',
	  'bithub/models/award.js',
	  'can/construct/proxy',
	  'bithub/helpers/ejsHelpers.js',
	  function(can, initView, latestView, greatestView, eventPartial, eventChildrenPartial, eventCodePartial, eventTwitterPartial, digestPartial, Event, Upvote, Award){

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
				  }
			  ],
			  
			  // used for ordering categories on latest view
			  latestCategories = ['twitter','bug', 'comment', 'feature', 'question', 'article', 'plugin', 'app', 'code'],

			  ejsHelpers = {
				  eventUrl: function( event ) {
					  if (event.attr('url')) {
						  return "<a href=\"" + event.attr('url') + "\">" + event.attr('title') + "</a>";
					  } else {
						  return can.route.link( event.attr('title'), {id: event.attr('id')}, {} )
					  }
				  },
				  getAuthorName: function( event ) {
					  return event.attr('author.name') || event.attr('props.origin_author_name') || '';
				  },
				  award_sum: function( event ) {
					  return event.attr('award_value') + event.attr('upvotes') + event.attr('anteups');
				  },
				  award_closed: function( event ) {
					  var closed = false;
					  event.attr('children').forEach( function( child ) {
						  if (child.attr('props').attr('awarded')) closed = true;
					  });
					  return closed;
				  }				  
			  };
		  
		  return can.Control(
			  {
				  defaults : {
					  spinner: can.compute(false),
					  spinnerBottom: can.compute(false)
				  }
			  }, {
				  init : function( elem, opts ){
					  var self = this;

					  window.LATEST = this.latestEvents = new Bithub.Models.Event.List(),
					  window.LATEST_IDX = this.latestIndex = new can.Observe.List([]);
					  window.GREATEST = this.greatestEvents = new Bithub.Models.Event.List(),			
					  this.currentView = can.compute('latest');
					  
					  /* TODO: live updating
					  opts.socket && opts.socket.on('new_event', function( event ) {
						  console.log( event );
					  });
					   */

					  can.extend(can.EJS.Helpers.prototype, ejsHelpers);					  
					  can.extend(can.EJS.Helpers.prototype, {
						  isAdmin: function() {
							  return opts.currentUser.attr('admin');
						  }
					  });
					  
					  this.element.html( initView({
						  latestEvents: self.latestEvents,
						  days: self.latestIndex,
						  greatestEvents: self.greatestEvents,
						  partial: this.currentView,
						  latestView: latestView,
						  greatestView: greatestView,
						  eventPartial: this.determineEventPartial,
						  eventChildrenPartial: eventChildrenPartial,
						  digestPartial: digestPartial,
						  latestCategories: latestCategories,
						  projects: opts.projects,
						  categories: opts.categories
					  }) );

					  self.options.spinner(true);

					  this.load();
				  },

				  /*
				   * Event handlers
				   */

				  '.expand-replies click': function( el, ev ) {
					  el.find('span.icon').toggleClass('collapse').closest('.event').find('.replies').toggle();
				  },
				  
				  '.voteup click': function( el, ev ) {
					  this.upvote( can.data(el.closest('.event'), 'eventObj') );
					  //can.data(el.closest('.event'), 'event').upvote();
				  },

				  '.replies .votes click': function( el, ev ) {
					  this.upvote( can.data(el.closest('.reply-event'), 'eventObj') );
					  //var event = can.data(el.closest('.reply-event'), 'event');
					  //(new Upvote({event: event})).upvote();
				  },

				  '.award-btn click': function( el, ev ) {
					  ev.preventDefault();

					  var event = can.data(el.closest('.reply-event'), 'eventObj');
					  (new Award({event: event})).award();
				  },

				  '.expand-manage-bar click': function( el, ev ) {
					  ev.preventDefault();
					  el.closest('.event').find('.manage-bar').slideToggle();
				  },

				  '.manage-bar .tag-action click': function( el, ev ) {
					  ev.preventDefault();

					  var event = can.data(el.closest('.event'), 'eventObj');
					  var tag = el.data('tag');
					  var tags = event.attr('tags');

					  (tags.indexOf(tag) >= 0) ? tags.splice(tags.indexOf(tag), 1) : tags.push(tag);
					  event.save();
				  },

				  '.manage-bar .category-action click': function( el, ev ) {
					  ev.preventDefault();

					  var event = can.data(el.closest('.event'), 'eventObj');

					  event.attr('category', el.data('category'));
					  event.save();
				  },

				  '.delete-event click': function( el, ev ) {
					  ev.preventDefault();
					  var self = this;
					  var event = can.data(el.closest('.event.list-element'), 'eventObj');
					  event.destroy(function() { self.load(self.updateEvents) });
				  },

				  // can.route listeners

				  '{can.route} view': function( data, ev, newVal, oldVal ) {
					  this.resetFilter();
					  this.options.spinner(true);
					  this.load( this.updateEvents );
				  },
				  
				  '{can.route} project': function( data, ev, newVal, oldVal ) {
					  this.resetFilter();
					  this.options.spinner(true);
					  this.load( this.updateEvents );
				  },
				  
				  '{can.route} category': function( data, ev, newVal, oldVal ) {
					  this.resetFilter();
					  this.options.spinner(true);
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

					  this.options.spinnerBottom(true);
					  this.load( this.appendEvents );
				  },

				  // spinner

				  '{spinner} change': function( fn, ev, newVal, oldVal ) {
					  var el = this.element;
					  
					  if( newVal ) {
						  el.find('.events-container').hide();
						  el.find('.spinner').show()
					  } else {
						  el.find('.spinner').hide()
						  el.find('.events-container').show();
					  }
				  },

				  '{spinnerBottom} change': function( fn, ev, newVal, oldVal ) {
					  var $spinner = this.element.find('.spinnerBottom');

					  newVal ? $spinner.show() : $spinner.hide();
				  },

				  /*
				   * Functions
				   */

				  determineEventPartial: function( tags ) {
					  var template = eventPartial, //default
						  bestScore = 0;

					  can.each( eventPartialsLookup, function( partial ) {
						  var score = 0;
						  
						  can.each(tags, function( tag ) {
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
						  //this.latestEvents.replace( events.latest() );
						  this.latestEvents.replace( events );
						  this.latestIndex.replace( events.latest() );
						  this.options.spinner( false );
					  }
					  this.currentView( can.route.attr('view') );
				  },
				  
				  appendLatest: function( events ) {
					  var self = this;
					  var buffer = new can.Observe.List( this.latestIndex );
					  
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

					  $.each(events, function( i, event ) {
						  self.latestEvents.push( event );
					  });
					  this.latestIndex.replace( buffer );
				  },
				  
				  updateGreatest: function( events ) {
					  this.greatestEvents.replace( events );
					  this.options.spinner(false);
					  this.currentView( can.route.attr('view') );
				  },
				  
				  appendGreatest: function( events ) {
					  var buffer = new Bithub.Models.Event.List( this.greatestEvents );
					  events.forEach( function( event ) {
						  buffer.push( event );
					  });				  
					  this.options.spinnerBottom(false);
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
