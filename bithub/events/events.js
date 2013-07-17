steal('can',
	  './init.ejs',
	  './latest.ejs',
	  './greatest.ejs',
	  './_event.ejs',
	  './_event_children.ejs',
	  './_event_default.ejs',
	  './_event_code.ejs',
	  './_event_twitter.ejs',
	  './_event_event.ejs',
	  './_digest.ejs',
	  'bithub/models/event.js',
	  'bithub/models/upvote.js',
	  'bithub/models/award.js',
	  'can/construct/proxy',
	  'bithub/helpers/ejsHelpers.js',
	  'ui/more',
	  function(can,
			   initView,
			   latestView,
			   greatestView,
			   eventPartial,
			   eventChildrenPartial,
			   eventDefaultPartial,
			   eventCodePartial,
			   eventTwitterPartial,
			   eventEventPartial,
			   digestPartial,
			   Event,
			   Upvote,
			   Award
			  ) {

		  var emptyReqCounter = 0,
			  emptyReqTreshold = 5,
			  
			  // lookup table for dynamic loading of event partials 
			  eventPartialsLookup = [
				  {
					  template: eventCodePartial,
					  tags: ['push_event']
				  }, {
					  template: eventTwitterPartial,
					  tags: ['status_event']
				  }, {
					  template: eventEventPartial,
					  tags: ['event']
				  }
			  ],
			  
			  // used for ordering categories on latest view
			  latestCategories = ['twitter','bug', 'comment', 'feature', 'question', 'article', 'plugin', 'app', 'code', 'event'];

		  return can.Control(
			  {
				  defaults : {
					  spinner: can.compute(false),
					  spinnerBottom: can.compute(false)
				  }
			  }, {
				  init : function( elem, opts ){
					  var self = this;

					  window.LATEST        = this.latestEvents   = new Bithub.Models.Event.List();
					  window.LATEST_IDX    = this.latestIndex    = new can.Observe.List([]);
					  window.GREATEST      = this.greatestEvents = new Bithub.Models.Event.List();
					  
					  this.currentView = can.compute('latest');
					  
					  /* TODO: live updating
					  opts.socket && opts.socket.on('new_event', function( event ) {
						  console.log( event );
					  });
					   */

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
						  eventPartial: eventPartial,
						  determineEventPartial: this.determineEventPartial,
						  eventChildrenPartial: eventChildrenPartial,
						  digestPartial: digestPartial,
						  latestCategories: latestCategories,
						  projects: opts.projects,
						  categories: opts.categories
					  }) );

					  self.options.spinner(true);
				  },

				  /*
				   * Event handlers
				   */

				  '.expand-replies click': function( el, ev ) {
					  el.find('span.icon').toggleClass('collapse').closest('.event').find('.replies').toggle();
				  },
				  
				  '.voteup click': function( el, ev ) {
					  this.upvote( can.data(el.closest('.event'), 'eventObj') );
				  },

				  '.event-metadata a click': function( el, ev ) {
					  window.location = el.attr('href');
				  },

				  '.replies .votes click': function( el, ev ) {
					  this.upvote( can.data(el.closest('.reply-event'), 'eventObj') );
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
					  event.destroy( function() {
						  el.closest('.event.list-element').fadeOut();
					  });
				  },

				  // preload
				  '{preloadedEvents} change': function() {
					  this.updateEvents( this.options.preloadedEvents );
				  },
				  
				  // can.route listeners

				  '{can.route} view': function( data, ev, newVal, oldVal ) {
					  this.options.prepareParams.resetFilter();
					  this.options.spinner(true);
					  this.load( this.updateEvents );
				  },
				  
				  '{can.route} project': function( data, ev, newVal, oldVal ) {
					  this.options.prepareParams.resetFilter();
					  this.options.spinner(true);
					  this.load( this.updateEvents );
				  },
				  
				  '{can.route} category': function( data, ev, newVal, oldVal ) {
					  this.options.prepareParams.resetFilter();
					  this.options.spinner(true);
					  this.load( this.updateEvents );
				  },

				  // infinite scroll
				  
				  '{window} onbottom': function( el, ev ) {
					  var views = this.options.prepareParams.views;
					  
					  if (can.route.attr('view') === 'latest') {
						  if (can.route.attr('project') !== 'all' || can.route.attr('category') !== 'all') {
							  views.latest.byLimit.attr('offset', views.latest.byLimit.offset + views.latest.byLimit.limit);
						  } else {
							  this.options.prepareParams.decrementLatestDate();
						  }
					  } else {
						  views.greatest.attr('offset', views.greatest.offset + views.greatest.limit);
					  }

					  this.options.spinnerBottom(true);
					  this.load( this.appendEvents );
				  },

				  // spinner

				  '{spinner} change': function( fn, ev, newVal, oldVal ) {
					  var el = this.element,
						  preservedHeight = el.css('height'); // To prevent content bobbing (caused by removing of scrollbar in FF);
					  
					  if( newVal ) {
						  el.css('height', preservedHeight);
						  el.find('.events-container').hide();
						  el.find('.spinner').show()
					  } else {
						  el.css('height', 'auto');
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
					  var template = eventDefaultPartial, //default
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

				  load: function( cb, params ) {
					  // events are preloaded in bithub.js immediately after can.route is initalized
					  if( !window.EVENTS_PRELOADED ) return;
					  
					  clearTimeout( this.loadTimeout );
					  this.loadTimeout = setTimeout( this.proxy( function () {
						  Event.findAll( this.options.prepareParams.prepareParams(), this.proxy( cb ) );
					  }) );
				  },

				  updateLatest: function( events ) {
					  if (events.length == 0 && ++emptyReqCounter < emptyReqTreshold) {
						  this.decrementLatestDate();
						  this.load( this.updateLatest );
					  } else {
						  emptyReqCounter = 0;
						  this.latestEvents.replace( events );
						  this.latestIndex.replace( events.latest() );
						  this.options.spinner( false );
						  this.applyMore();
					  }
					  this.currentView( can.route.attr('view') );
				  },
				  
				  appendLatest: function( events ) {
					  var self = this,
						  buffer = new can.Observe.List( this.latestIndex ),
						  offset = this.latestEvents.length;

					  $.each(events.latest( offset ), function( i, day ) {
						  // merge with previous day or push new day
						  if (buffer[buffer.length-1].attr('date') === day.date) {
							  for( var category in day ) {
								  if (buffer[buffer.length-1][category]) {
									  can.merge( buffer[buffer.length-1][category], day[category] );
								  } else {
									  buffer[buffer.length-1].attr(category, day[category])
								  }
							  };
						  } else {
							  buffer.push( day );
						  }
					  });

					  this.latestEvents.push.apply(this.latestEvents, events );					  
					  this.latestIndex.replace( buffer );
					  this.applyMore();
				  },
				  
				  updateGreatest: function( events ) {
					  this.greatestEvents.replace( events );
					  this.options.spinner(false);
					  this.currentView( can.route.attr('view') );
					  this.applyMore();
				  },
				  
				  appendGreatest: function( events ) {
					  this.greatestEvents.push.apply(this.greatestEvents, events );
					  this.options.spinnerBottom(false);
					  this.applyMore();
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
				  },
				  
				  applyMore: function() {
					  /* Disabled because it sometimes breaks on certain types of content */
					  /* this.element.find('.event .body:not(.reply)').more(); */
				  }
			  });
	  });
